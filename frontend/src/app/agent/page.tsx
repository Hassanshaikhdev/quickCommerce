'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, ShoppingCart, ArrowLeft, Sparkles, MessageSquare } from 'lucide-react';
import BotInterface from '@/components/bot-interface';

export default function AgentPage() {
  const [agentId, setAgentId] = useState<string>('');
  const [storeId, setStoreId] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    initializeAgent();
  }, []);

  const initializeAgent = async () => {
    try {
      setLoading(true);
      
      // Get user info
      const userResponse = await fetch('/api/auth/me');
      const userData = await userResponse.json();
      
      if (!userData.success) {
        router.push('/auth/login');
        return;
      }

      setCustomerId(userData.data.id);

      // Get default store (you might want to let user select store)
      const storeResponse = await fetch('/api/stores/default');
      const storeData = await storeResponse.json();
      
      if (storeData.success) {
        setStoreId(storeData.data.id);
      } else {
        // Create a default store or redirect to store selection
        console.error('No store found');
      }

      // Get or create agent
      const agentResponse = await fetch('/api/agents/default');
      const agentData = await agentResponse.json();
      
      if (agentData.success) {
        setAgentId(agentData.data.id);
      } else {
        console.error('No agent found');
      }
    } catch (error) {
      console.error('Error initializing agent:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing AI Agent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AI Shopping Assistant</h1>
                  <p className="text-sm text-gray-600">Powered by advanced AI</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">AI Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
              {agentId && storeId && customerId ? (
                <BotInterface
                  agentId={agentId}
                  storeId={storeId}
                  customerId={customerId}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Initializing chat...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/catalog')}
                    className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">Browse Products</p>
                      <p className="text-sm text-gray-600">View all available items</p>
                    </div>
                    <ShoppingCart className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => router.push('/cart')}
                    className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">View Cart</p>
                      <p className="text-sm text-gray-600">Check your cart items</p>
                    </div>
                    <ShoppingCart className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <MessageSquare className="w-5 h-5 inline mr-2" />
                  Tips for Better Results
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-600">
                      Be specific with quantities and units (e.g., "2 kg rice" instead of "some rice")
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-600">
                      Mention brand names when you have preferences
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-600">
                      You can ask for alternatives if items are not available
                    </p>
                  </div>
                </div>
              </div>

              {/* Example Requests */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Example Requests
                </h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      "I need 2 packets of Aashirvaad atta, 1 litre Amul milk, and 5 bananas"
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      "Get me 3 bottles of Bisleri, 2 bread packets, and 6 eggs"
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      "Order 1 kg tomatoes, 500g onions, and 2 kg potatoes"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 