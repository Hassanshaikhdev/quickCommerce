import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class BotService {
  async parseOrderRequest(message: string, storeId: string, agentId: string) {
    try {
      // Simple parsing logic for demo
      const items = this.extractItems(message);
      
      // Get store inventory
      const inventory = await this.getStoreInventory(storeId);
      
      // Match items with inventory
      const matchedItems = this.matchItemsWithInventory(items, inventory);
      
      return {
        success: true,
        items: matchedItems,
        total: this.calculateTotal(matchedItems),
        message: 'Order parsed successfully'
      };
    } catch (error) {
      console.error('Error parsing order request:', error);
      return {
        success: false,
        error: 'Failed to parse order request'
      };
    }
  }

  private extractItems(message: string) {
    // Simple item extraction for demo
    const items = [];
    const lines = message.toLowerCase().split('\n');
    
    for (const line of lines) {
      if (line.includes('apple')) items.push({ name: 'apples', quantity: 1, unit: 'kg' });
      if (line.includes('milk')) items.push({ name: 'milk', quantity: 1, unit: 'liter' });
      if (line.includes('bread')) items.push({ name: 'bread', quantity: 1, unit: 'loaf' });
      if (line.includes('chip')) items.push({ name: 'chips', quantity: 1, unit: 'bag' });
    }
    
    return items;
  }

  private async getStoreInventory(storeId: string) {
    return await prisma.inventoryItem.findMany({
      where: { storeId, isActive: true },
      include: { category: true }
    });
  }

  private matchItemsWithInventory(items: any[], inventory: any[]) {
    return items.map(item => {
      const match = inventory.find(inv => 
        inv.name.toLowerCase().includes(item.name) ||
        item.name.includes(inv.name.toLowerCase())
      );
      
      return match ? {
        ...item,
        inventoryItem: match,
        price: match.price,
        available: match.stockQuantity > 0
      } : null;
    }).filter(Boolean);
  }

  private calculateTotal(items: any[]) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

export const botService = new BotService(); 