'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import { ParsedOrderRequest, ParsedItem, AlternativeItem } from '@/types';

interface BotMessage {
  id: string;
  message: string;
  type: 'user' | 'bot';
  timestamp: Date;
  data?: ParsedOrderRequest;
}

interface BotInterfaceProps {
  agentId: string;
  storeId: string;
  customerId: string;
}

export default function BotInterface({ agentId, storeId, customerId }: BotInterfaceProps) {
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedOrder, setParsedOrder] = useState<ParsedOrderRequest | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: string, type: 'user' | 'bot', data?: ParsedOrderRequest) => {
    const newMessage: BotMessage = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      data,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    addMessage(userMessage, 'user');
    setIsLoading(true);

    try {
      // Parse the order request
      const parseResponse = await fetch('/api/bot/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          storeId,
          agentId,
        }),
      });

      const parseResult = await parseResponse.json();

      if (parseResult.success) {
        const parsedData = parseResult.data;
        setParsedOrder(parsedData);

        // Generate bot response
        const botResponse = generateBotResponse(parsedData);
        addMessage(botResponse, 'bot', parsedData);
      } else {
        addMessage('I\'m sorry, I couldn\'t understand your request. Please try again.', 'bot');
      }
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage('I\'m sorry, I\'m having trouble processing your request right now.', 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  const generateBotResponse = (parsedData: ParsedOrderRequest): string => {
    const { items, totalAmount, alternatives } = parsedData;
    
    let response = 'I found the following items:\n\n';
    
    items.forEach((item, index) => {
      const status = item.matchedItemId ? '✅' : '❌';
      response += `${index + 1}. ${status} ${item.name} - ${item.quantity} ${item.unit}\n`;
    });
    
    response += `\nTotal: ₹${totalAmount.toFixed(2)}`;
    
    if (alternatives.length > 0) {
      response += '\n\nI also found some alternatives for items that weren\'t available:';
      alternatives.forEach((alt, index) => {
        response += `\n${index + 1}. ${alt.name} - ₹${alt.price} (${alt.reason})`;
      });
    }
    
    response += '\n\nWould you like me to create this order for you?';
    
    return response;
  };

  const handleCreateOrder = async () => {
    if (!parsedOrder) return;

    setIsCreatingOrder(true);

    try {
      // Filter items that have matches
      const validItems = parsedOrder.items
        .filter(item => item.matchedItemId)
        .map(item => ({
          itemId: item.matchedItemId!,
          quantity: item.quantity,
          notes: `Parsed from: ${item.name}`,
        }));

      if (validItems.length === 0) {
        addMessage('I couldn\'t find any matching items in the store inventory. Please try with different items.', 'bot');
        return;
      }

      const orderResponse = await fetch('/api/bot/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          storeId,
          customerId,
          items: validItems,
          deliveryAddress: {
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            country: 'India',
          },
          deliveryInstructions: 'Please deliver to the main entrance',
          paymentMethod: 'COD',
        }),
      });

      const orderResult = await orderResponse.json();

      if (orderResult.success) {
        const order = orderResult.data.order;
        const botResponse = orderResult.data.botResponse;
        
        addMessage(botResponse, 'bot');
        addMessage(`Order created successfully! Order ID: ${order.id}`, 'bot');
      } else {
        addMessage(`Failed to create order: ${orderResult.error}`, 'bot');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      addMessage('I\'m sorry, I couldn\'t create the order. Please try again.', 'bot');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Order Assistant</h3>
            <p className="text-sm text-gray-500">Powered by GPT-4</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-500">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to QuickCommerce Bot!</h3>
            <p className="text-gray-500">
              Just tell me what you need and I'll help you create an order. For example:
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">"I need 2 packets of Aashirvaad atta, 1 litre Amul milk, and 5 bananas"</p>
              <p className="text-sm text-gray-600">"Get me 3 bottles of Bisleri, 2 bread packets, and 6 eggs"</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'bot' && (
                  <Bot className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  
                  {message.data && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="space-y-2">
                        {message.data.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="flex items-center">
                              {item.matchedItemId ? (
                                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                              ) : (
                                <AlertCircle className="w-3 h-3 text-yellow-500 mr-1" />
                              )}
                              {item.name}
                            </span>
                            <span className="text-gray-500">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total:</span>
                          <span>₹{message.data.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {message.data.items.some(item => item.matchedItemId) && (
                        <button
                          onClick={handleCreateOrder}
                          disabled={isCreatingOrder}
                          className="mt-3 w-full btn-primary text-xs py-1.5 flex items-center justify-center"
                        >
                          {isCreatingOrder ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <ShoppingCart className="w-3 h-3 mr-1" />
                          )}
                          {isCreatingOrder ? 'Creating Order...' : 'Create Order'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {message.type === 'user' && (
                  <User className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-primary-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your grocery list here..."
            className="flex-1 input"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="btn-primary px-4"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
} 