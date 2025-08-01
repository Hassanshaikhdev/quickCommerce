// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

db = db.getSiblingDB('quickcommerce');

// Create a user for the application
db.createUser({
  user: 'quickcommerce_user',
  pwd: 'quickcommerce_password',
  roles: [
    {
      role: 'readWrite',
      db: 'quickcommerce'
    }
  ]
});

// Create initial collections
db.createCollection('users');
db.createCollection('stores');
db.createCollection('categories');
db.createCollection('inventory_items');
db.createCollection('orders');
db.createCollection('order_items');
db.createCollection('bot_sessions');
db.createCollection('bot_messages');
db.createCollection('notifications');

print('✅ MongoDB initialization completed');
print('📊 Database: quickcommerce');
print('👤 User: quickcommerce_user');
print('🔑 Collections created successfully'); 