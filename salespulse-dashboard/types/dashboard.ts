// ==============================================================================
// SalesPulse Dashboard — TypeScript Type Definitions
// ==============================================================================

export interface FilterParams {
  startDate?: string;
  endDate?: string;
  state?: string;
  category?: string;
}

export interface OverviewMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  totalProducts: number;
  totalSellers: number;
  averageDeliveryDays: number;
  onTimeDeliveryRate: number;
  totalFreight: number;
}

export interface MonthlyRevenuePoint {
  salesMonth: string;
  monthlyRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  momGrowthPct?: number | null;
}

export interface CategoryRevenueItem {
  category: string;
  totalRevenue: number;
  unitsSold: number;
  totalOrders: number;
  averagePrice: number;
  revenueSharePct?: number;
}

export interface ProductItem {
  productId: string;
  category: string;
  unitsSold: number;
  totalRevenue: number;
  averagePrice: number;
}

export interface StateRevenueItem {
  state: string;
  totalOrders: number;
  unitsSold: number;
  totalRevenue: number;
  revenueSharePct: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  repeatCustomers: number;
  oneTimeCustomers: number;
  repeatCustomerPct: number;
  avgRepurchaseDays: number;
  topCustomers: {
    customerUniqueId: string;
    totalOrders: number;
    lifetimeRevenue: number;
    firstPurchase: string;
    lastPurchase: string;
  }[];
  segments: {
    segment: string;
    customerCount: number;
    segmentRevenue: number;
    avgSpend: number;
  }[];
}

export interface DeliveryMetrics {
  averageDeliveryDays: number;
  onTimeDeliveryRate: number;
  onTimeOrders: number;
  delayedOrders: number;
  totalDelivered: number;
  onTimeAvgRating: number;
  delayedAvgRating: number;
  topDelayedOrders: {
    orderId: string;
    purchaseDate: string;
    estimatedDelivery: string;
    actualDelivery: string;
    delayDays: number;
  }[];
}

export interface FilterOptions {
  states: string[];
  categories: string[];
  minDate: string;
  maxDate: string;
}

