// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  avatar?: string;
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
  logo?: string;
  banner?: string;
  isActive: boolean;
  managerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  storeId: string;
  parent?: Category;
  children?: Category[];
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
  isFeatured: boolean;
  brand?: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  storeId: string;
  categoryId: string;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Types
export interface CartItem {
  id: string;
  quantity: number;
  userId: string;
  inventoryItemId: string;
  inventoryItem?: InventoryItem;
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
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerId: string;
  storeId: string;
  customer?: User;
  store?: Store;
  items?: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  inventoryItemId: string;
  inventoryItem?: InventoryItem;
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

export type PaymentMethod = 
  | 'CASH_ON_DELIVERY'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'UPI'
  | 'NET_BANKING'
  | 'WALLET';

export type PaymentStatus = 
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED';

// Review Types
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  isVerified: boolean;
  userId: string;
  inventoryItemId: string;
  user?: User;
  inventoryItem?: InventoryItem;
  createdAt: Date;
  updatedAt: Date;
}

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
  agent?: User;
  order?: Order;
  messages?: BotMessage[];
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
  user?: User;
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
  sortBy?: 'name' | 'price' | 'popularity' | 'newest' | 'rating';
  sortOrder?: 'asc' | 'desc';
  brand?: string;
  tags?: string[];
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
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  role?: UserRole;
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
  paymentMethod?: PaymentMethod;
}

export interface CartForm {
  itemId: string;
  quantity: number;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ErrorState {
  message: string;
  code?: string;
  details?: any;
}

// Component Props Types
export interface ProductCardProps {
  product: InventoryItem;
  onAddToCart?: (itemId: string, quantity: number) => void;
  onViewDetails?: (itemId: string) => void;
}

export interface CartSummaryProps {
  items: CartItem[];
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onCheckout?: () => void;
}

export interface ProductFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  categories: Category[];
} 