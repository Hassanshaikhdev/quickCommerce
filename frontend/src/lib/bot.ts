import OpenAI from 'openai';
import { ParsedOrderRequest, ParsedItem, AlternativeItem, InventoryItem } from '@/types';
import { prisma } from './db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface BotConfig {
  model: string;
  maxTokens: number;
  temperature: number;
}

const DEFAULT_CONFIG: BotConfig = {
  model: 'gpt-4',
  maxTokens: 1000,
  temperature: 0.1,
};

export class BotService {
  private config: BotConfig;

  constructor(config: Partial<BotConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async parseOrderRequest(
    message: string,
    storeId: string,
    agentId: string
  ): Promise<ParsedOrderRequest> {
    try {
      // Get store inventory for context
      const inventory = await this.getStoreInventory(storeId);
      
      // Create prompt for OpenAI
      const prompt = this.createParsingPrompt(message, inventory);
      
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that helps parse grocery orders from natural language. You must return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const parsedResponse = JSON.parse(response);
      
      // Validate and enhance with inventory data
      const enhancedItems = await this.enhanceWithInventory(parsedResponse.items, inventory);
      
      // Calculate total amount
      const totalAmount = enhancedItems.reduce((sum, item) => {
        return sum + (item.matchedItemId ? 
          inventory.find(i => i.id === item.matchedItemId)?.price || 0 : 0) * item.quantity;
      }, 0);

      // Find alternatives for unmatched items
      const alternatives = await this.findAlternatives(enhancedItems, inventory);

      return {
        items: enhancedItems,
        totalAmount,
        confidence: parsedResponse.confidence || 0.8,
        alternatives,
      };
    } catch (error) {
      console.error('Error parsing order request:', error);
      throw new Error('Failed to parse order request');
    }
  }

  private createParsingPrompt(message: string, inventory: InventoryItem[]): string {
    const inventoryContext = inventory
      .slice(0, 50) // Limit to first 50 items for context
      .map(item => `${item.name} - ${item.unit}`)
      .join('\n');

    return `
Parse the following grocery order request into structured JSON format.

Available items in store:
${inventoryContext}

User message: "${message}"

Please extract items with the following structure:
{
  "items": [
    {
      "name": "item name",
      "quantity": number,
      "unit": "unit of measurement"
    }
  ],
  "confidence": 0.0-1.0
}

Rules:
1. Normalize units (e.g., "packets" -> "packet", "litres" -> "l", "kilos" -> "kg")
2. Extract brand names when mentioned
3. Handle common abbreviations and typos
4. Return only valid JSON
`;
  }

  private async getStoreInventory(storeId: string): Promise<InventoryItem[]> {
    const items = await prisma.inventoryItem.findMany({
      where: {
        storeId,
        isActive: true,
        stockQuantity: { gt: 0 },
      },
      select: {
        id: true,
        name: true,
        unit: true,
        price: true,
        category: {
          select: { name: true }
        },
      },
    });

    return items.map(item => ({
      ...item,
      price: Number(item.price),
      category: item.category.name,
    }));
  }

  private async enhanceWithInventory(
    parsedItems: any[],
    inventory: InventoryItem[]
  ): Promise<ParsedItem[]> {
    return parsedItems.map(item => {
      // Find best match in inventory
      const match = this.findBestMatch(item.name, inventory);
      
      return {
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        matchedItemId: match?.id,
        confidence: match ? 0.9 : 0.3,
        alternatives: match ? [] : this.findSimilarItems(item.name, inventory),
      };
    });
  }

  private findBestMatch(itemName: string, inventory: InventoryItem[]): InventoryItem | null {
    const normalizedName = itemName.toLowerCase().trim();
    
    // Exact match
    let match = inventory.find(item => 
      item.name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(item.name.toLowerCase())
    );
    
    if (match) return match;

    // Fuzzy match (simple implementation)
    const words = normalizedName.split(' ');
    match = inventory.find(item => {
      const itemWords = item.name.toLowerCase().split(' ');
      return words.some(word => 
        itemWords.some(itemWord => 
          itemWord.includes(word) || word.includes(itemWord)
        )
      );
    });

    return match || null;
  }

  private findSimilarItems(itemName: string, inventory: InventoryItem[]): AlternativeItem[] {
    const normalizedName = itemName.toLowerCase();
    const words = normalizedName.split(' ');
    
    const similar = inventory
      .filter(item => {
        const itemWords = item.name.toLowerCase().split(' ');
        return words.some(word => 
          itemWords.some(itemWord => 
            itemWord.includes(word) || word.includes(itemWord)
          )
        );
      })
      .slice(0, 3)
      .map(item => ({
        itemId: item.id,
        name: item.name,
        price: item.price,
        reason: `Similar to "${itemName}"`,
        confidence: 0.6,
      }));

    return similar;
  }

  private async findAlternatives(
    items: ParsedItem[],
    inventory: InventoryItem[]
  ): Promise<AlternativeItem[]> {
    const unmatchedItems = items.filter(item => !item.matchedItemId);
    const alternatives: AlternativeItem[] = [];

    for (const item of unmatchedItems) {
      const similar = this.findSimilarItems(item.name, inventory);
      alternatives.push(...similar);
    }

    return alternatives;
  }

  async generateBotResponse(
    message: string,
    sessionId: string,
    storeId: string
  ): Promise<string> {
    try {
      // Get session context
      const session = await prisma.botSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });

      if (!session) {
        return "I'm sorry, I couldn't find your session. Please start a new order.";
      }

      // Create context-aware prompt
      const context = session.messages
        .reverse()
        .map(msg => `${msg.type === 'USER' ? 'User' : 'Bot'}: ${msg.content}`)
        .join('\n');

      const prompt = `
You are a helpful grocery ordering assistant. Here's the conversation context:

${context}

User: ${message}

Please provide a helpful, friendly response. If the user is placing an order, acknowledge it and ask for confirmation. If they have questions, answer them clearly.

Response:`;

      const completion = await openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful grocery ordering assistant. Be friendly, concise, and helpful.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your request.";
    } catch (error) {
      console.error('Error generating bot response:', error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again.";
    }
  }

  async saveBotMessage(
    sessionId: string,
    agentId: string,
    storeId: string,
    message: string,
    type: 'USER' | 'BOT',
    metadata?: Record<string, any>
  ): Promise<void> {
    await prisma.botMessage.create({
      data: {
        sessionId,
        content: message,
        type,
        metadata,
      },
    });
  }
}

export const botService = new BotService(); 