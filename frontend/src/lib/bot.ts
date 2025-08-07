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
  model: 'gpt-3.5-turbo', // Use a more reliable model
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
      const enhancedItems = await this.enhanceWithInventory(parsedResponse.items || [], inventory);
      
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
      // Return a fallback response if OpenAI fails
      return this.createFallbackResponse(message);
    }
  }

  private createFallbackResponse(message: string): ParsedOrderRequest {
    // Simple fallback parsing logic
    const words = message.toLowerCase().split(' ');
    const items: ParsedItem[] = [];
    
    // Basic parsing logic for common items
    const commonItems = ['milk', 'bread', 'rice', 'atta', 'banana', 'tomato', 'water', 'soap'];
    
    for (const word of words) {
      if (commonItems.includes(word)) {
        items.push({
          name: word,
          quantity: 1,
          unit: 'piece',
          confidence: 0.5,
        });
      }
    }

    return {
      items,
      totalAmount: 0,
      confidence: 0.3,
      alternatives: [],
    };
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

User request: "${message}"

Please return a JSON object with the following structure:
{
  "items": [
    {
      "name": "item name",
      "quantity": number,
      "unit": "kg/liter/piece/etc"
    }
  ],
  "confidence": number between 0 and 1
}

Only return valid JSON, no additional text.`;
  }

  private async getStoreInventory(storeId: string): Promise<InventoryItem[]> {
    try {
      const inventory = await prisma.inventoryItem.findMany({
        where: {
          storeId,
          isActive: true,
          isAvailable: true,
        },
        select: {
          id: true,
          name: true,
          price: true,
          unit: true,
          stockQuantity: true,
          brand: true,
          tags: true,
        },
        take: 100, // Limit to 100 items for context
      });

      return inventory;
    } catch (error) {
      console.error('Error fetching store inventory:', error);
      return [];
    }
  }

  private async enhanceWithInventory(
    parsedItems: any[],
    inventory: InventoryItem[]
  ): Promise<ParsedItem[]> {
    const enhancedItems: ParsedItem[] = [];

    for (const item of parsedItems) {
      const matchedItem = this.findBestMatch(item.name, inventory);
      
      enhancedItems.push({
        name: item.name,
        quantity: item.quantity || 1,
        unit: item.unit || 'piece',
        matchedItemId: matchedItem?.id,
        confidence: matchedItem ? 0.9 : 0.3,
      });
    }

    return enhancedItems;
  }

  private findBestMatch(itemName: string, inventory: InventoryItem[]): InventoryItem | null {
    const normalizedName = itemName.toLowerCase().trim();
    
    // Exact match
    let match = inventory.find(item => 
      item.name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(item.name.toLowerCase())
    );

    if (match) return match;

    // Partial match
    match = inventory.find(item => 
      item.name.toLowerCase().split(' ').some(word => 
        normalizedName.includes(word) || word.includes(normalizedName)
      )
    );

    if (match) return match;

    // Brand match
    match = inventory.find(item => 
      item.brand && item.brand.toLowerCase().includes(normalizedName)
    );

    return match || null;
  }

  private findSimilarItems(itemName: string, inventory: InventoryItem[]): AlternativeItem[] {
    const normalizedName = itemName.toLowerCase();
    const similar: AlternativeItem[] = [];

    for (const item of inventory) {
      const itemNameLower = item.name.toLowerCase();
      const similarity = this.calculateSimilarity(normalizedName, itemNameLower);
      
      if (similarity > 0.3) {
        similar.push({
          itemId: item.id,
          name: item.name,
          price: item.price,
          reason: `Similar to "${itemName}"`,
          confidence: similarity,
        });
      }
    }

    return similar.slice(0, 3); // Return top 3 similar items
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
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
        .map((msg: { type: string; content: string }) => `${msg.type === 'USER' ? 'User' : 'Bot'}: ${msg.content}`)
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
    try {
      // First, try to find or create the bot session
      let session = await prisma.botSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        // Create a new session if it doesn't exist
        session = await prisma.botSession.create({
          data: {
            id: sessionId,
            sessionId: sessionId,
            status: 'ACTIVE',
            agentId,
          },
        });
      }

      // Now save the message
      await prisma.botMessage.create({
        data: {
          sessionId: session.id,
          content: message,
          type,
          metadata,
        },
      });
    } catch (error) {
      console.error('Error saving bot message:', error);
      // Don't throw error, just log it
    }
  }
}

export const botService = new BotService(); 