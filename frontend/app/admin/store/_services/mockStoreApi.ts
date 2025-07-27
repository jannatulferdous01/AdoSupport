// _services/mockStoreApi.ts
"use client";

export interface StoreStatsData {
  overview: {
    totalProducts: number;
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    trends: {
      productsChange: number;
      revenueChange: number;
      ordersChange: number;
      customersChange: number;
    };
  };
  categories: {
    books: { count: number; revenue: number; trend: number };
    resources: { count: number; revenue: number; trend: number };
    courses: { count: number; revenue: number; trend: number };
    therapy: { count: number; revenue: number; trend: number };
  };
  recentActivity: {
    recentOrders: number;
    pendingOrders: number;
    lowStockItems: number;
    newProducts: number;
  };
}

class MockStoreApi {
  private delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async fetchStoreStats(): Promise<StoreStatsData> {
    await this.delay(1000);

    return {
      overview: {
        totalProducts: 186,
        totalRevenue: 24580,
        totalOrders: 342,
        totalCustomers: 128,
        trends: {
          productsChange: 8.2,
          revenueChange: 15.4,
          ordersChange: 12.8,
          customersChange: 6.3,
        },
      },
      categories: {
        books: { count: 45, revenue: 8940, trend: 12.5 },
        resources: { count: 62, revenue: 6750, trend: 18.2 },
        courses: { count: 38, revenue: 5820, trend: -3.1 },
        therapy: { count: 41, revenue: 3070, trend: 22.8 },
      },
      recentActivity: {
        recentOrders: 15,
        pendingOrders: 8,
        lowStockItems: 12,
        newProducts: 6,
      },
    };
  }
}

export const mockStoreApi = new MockStoreApi();
