'use client';

import { useState } from 'react';
import BotInterface from '@/components/bot-interface';
import { ShoppingCart, Bot, Zap, Shield, Truck } from 'lucide-react';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('bot');

  // Sample data for demo
  const demoAgentId = 'demo-agent-123';
  const demoStoreId = 'demo-store-456';
  const demoCustomerId = 'demo-customer-789';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">QuickCommerce Demo</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Demo Mode</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Features */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">AI-Powered Quick Commerce</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Smart Order Parsing</h3>
                      <p className="text-gray-600 text-sm">
                        Simply type your grocery list in natural language and our AI will understand and create your order instantly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Lightning Fast</h3>
                      <p className="text-gray-600 text-sm">
                        Orders are processed in seconds with real-time inventory checks and instant pricing calculations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-warning-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Smart Substitutions</h3>
                      <p className="text-gray-600 text-sm">
                        When items are unavailable, our AI suggests intelligent alternatives to ensure you get what you need.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Instant Delivery</h3>
                      <p className="text-gray-600 text-sm">
                        Orders are dispatched within minutes with real-time tracking and guaranteed 30-minute delivery.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-primary-50 rounded-lg">
                  <h4 className="font-semibold text-primary-900 mb-2">Try these examples:</h4>
                  <ul className="space-y-2 text-sm text-primary-800">
                    <li>• "I need 2 packets of Aashirvaad atta, 1 litre Amul milk, and 5 bananas"</li>
                    <li>• "Get me 3 bottles of Bisleri, 2 bread packets, and 6 eggs"</li>
                    <li>• "Order 1 kg tomatoes, 500g onions, and 2 kg potatoes"</li>
                    <li>• "I want 4 apples, 2 oranges, and 1 kg rice"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Bot Interface */}
          <div className="lg:col-span-2">
            <div className="card h-[600px]">
              <BotInterface
                agentId={demoAgentId}
                storeId={demoStoreId}
                customerId={demoCustomerId}
              />
            </div>

            {/* Demo Info */}
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="card text-center">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Bot className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">AI Agent</h3>
                <p className="text-xs text-gray-500">GPT-4 Powered</p>
              </div>
              
              <div className="card text-center">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ShoppingCart className="w-4 h-4 text-success-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">Demo Store</h3>
                <p className="text-xs text-gray-500">Sample Inventory</p>
              </div>
              
              <div className="card text-center">
                <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-4 h-4 text-warning-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">Fast Delivery</h3>
                <p className="text-xs text-gray-500">30 Min Guarantee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of grocery shopping with our AI-powered ordering system
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Type Your List</h3>
              <p className="text-gray-600">
                Simply type your grocery list in natural language - just like you'd tell a friend.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-success-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Processing</h3>
              <p className="text-gray-600">
                Our AI instantly parses your request, matches items to inventory, and calculates pricing.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-warning-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Suggestions</h3>
              <p className="text-gray-600">
                Get intelligent alternatives for unavailable items and confirm your order with one click.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-secondary-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Delivery</h3>
              <p className="text-gray-600">
                Your order is processed immediately and delivered to your doorstep within 30 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 