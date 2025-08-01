// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'ADMIN' | 'STORE_MANAGER' | 'DELIVERY_AGENT' | 'AGENT' | 'CUSTOMER';

// Store Types
export interface Store {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  isActive: boolean;
  managerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  unit: string;
  weight?: number;
  dimensions?: any;
  images: string[];
  isActive: boolean;
  isAvailable: boolean;
  storeId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  deliveryInstructions?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
  customerId: string;
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  inventoryItemId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
  createdAt: Date;
}

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_DELIVERY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

// Bot Types
export interface BotMessage {
  id: string;
  sessionId: string;
  content: string;
  type: MessageType;
  metadata?: any;
  createdAt: Date;
}

export interface BotSession {
  id: string;
  sessionId: string;
  status: BotSessionStatus;
  agentId: string;
  orderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageType = 'USER' | 'BOT' | 'SYSTEM';
export type BotSessionStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface ParsedOrderRequest {
  items: ParsedItem[];
  totalAmount: number;
  confidence: number;
  alternatives: AlternativeItem[];
}

export interface ParsedItem {
  name: string;
  quantity: number;
  unit: string;
  matchedItemId?: string;
  confidence: number;
  alternatives?: AlternativeItem[];
}

export interface AlternativeItem {
  itemId: string;
  name: string;
  price: number;
  reason: string;
  confidence: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  activeStores: number;
  totalCustomers: number;
  deliverySuccessRate: number;
  popularItems: PopularItem[];
  recentOrders: Order[];
}

export interface PopularItem {
  itemId: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationType = 'ORDER_UPDATE' | 'STOCK_ALERT' | 'DELIVERY_UPDATE' | 'SYSTEM';

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'popularity' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface OrderForm {
  storeId: string;
  items: Array<{
    itemId: string;
    quantity: number;
    notes?: string;
  }>;
  deliveryAddress: string;
  deliveryInstructions?: string;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ErrorState {
  message: string;
  code?: string;
  details?: any;
} 