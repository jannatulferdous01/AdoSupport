"use client";

export interface ProductData {
  id: string;
  title: string;
  category: "books" | "resources" | "courses" | "therapy";
  price: number;
  stock: number;
  status: "active" | "inactive" | "out_of_stock";
  sales: number;
  rating: number;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

class MockProductsApi {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async fetchProducts(): Promise<ProductData[]> {
    await this.delay(800);
    
    return [
      {
        id: "1",
        title: "Anxiety Management Workbook",
        category: "books",
        price: 24.99,
        stock: 45,
        status: "active",
        sales: 234,
        rating: 4.8,
        author: "Dr. Sarah Johnson",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-07-20"),
      },
      {
        id: "2",
        title: "Teen Communication Course",
        category: "courses",
        price: 89.99,
        stock: 15,
        status: "active",
        sales: 87,
        rating: 4.9,
        author: "Prof. Michael Chen",
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-07-18"),
      },
      {
        id: "3",
        title: "Depression Worksheet Pack",
        category: "resources",
        price: 12.99,
        stock: 0,
        status: "out_of_stock",
        sales: 156,
        rating: 4.6,
        author: "Dr. Emily Davis",
        createdAt: new Date("2024-03-05"),
        updatedAt: new Date("2024-07-15"),
      },
      {
        id: "4",
        title: "Organic Cotton Sanitary Pads - Teen Size",
        category: "resources",
        price: 18.99,
        stock: 87,
        status: "active",
        sales: 312,
        rating: 4.7,
        author: "HealthCare Plus",
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-07-22"),
      },
      {
        id: "5",
        title: "Body Changes & Puberty Guide",
        category: "books",
        price: 19.99,
        stock: 62,
        status: "active",
        sales: 189,
        rating: 4.5,
        author: "Dr. Maria Rodriguez",
        createdAt: new Date("2024-02-15"),
        updatedAt: new Date("2024-07-19"),
      },
      {
        id: "6",
        title: "Menstrual Cup Starter Kit",
        category: "resources",
        price: 32.99,
        stock: 34,
        status: "active",
        sales: 128,
        rating: 4.4,
        author: "EcoFemme",
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2024-07-21"),
      },
      {
        id: "7",
        title: "Teen Acne Care Routine Kit",
        category: "resources",
        price: 29.99,
        stock: 71,
        status: "active",
        sales: 201,
        rating: 4.3,
        author: "ClearSkin Solutions",
        createdAt: new Date("2024-02-28"),
        updatedAt: new Date("2024-07-17"),
      },
      {
        id: "8",
        title: "Healthy Eating for Teens Course",
        category: "courses",
        price: 49.99,
        stock: 25,
        status: "active",
        sales: 67,
        rating: 4.6,
        author: "Nutritionist Sarah Lee",
        createdAt: new Date("2024-03-20"),
        updatedAt: new Date("2024-07-16"),
      },
      {
        id: "9",
        title: "Mental Health First Aid Toolkit",
        category: "resources",
        price: 15.99,
        stock: 0,
        status: "out_of_stock",
        sales: 243,
        rating: 4.9,
        author: "Teen Support Foundation",
        createdAt: new Date("2024-01-30"),
        updatedAt: new Date("2024-07-14"),
      },
      {
        id: "10",
        title: "Sleep Better Teen Program",
        category: "courses",
        price: 39.99,
        stock: 18,
        status: "active",
        sales: 94,
        rating: 4.2,
        author: "Dr. Sleep Specialist",
        createdAt: new Date("2024-04-05"),
        updatedAt: new Date("2024-07-23"),
      },
      {
        id: "11",
        title: "Teen Hygiene Essentials Pack",
        category: "resources",
        price: 24.99,
        stock: 56,
        status: "active",
        sales: 178,
        rating: 4.5,
        author: "HealthyLife Co.",
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-07-20"),
      },
      {
        id: "12",
        title: "Building Self-Esteem Workbook",
        category: "books",
        price: 22.99,
        stock: 43,
        status: "active",
        sales: 167,
        rating: 4.7,
        author: "Dr. Confidence Builder",
        createdAt: new Date("2024-02-25"),
        updatedAt: new Date("2024-07-18"),
      },
      {
        id: "13",
        title: "Individual Therapy Session",
        category: "therapy",
        price: 120.00,
        stock: 8,
        status: "active",
        sales: 45,
        rating: 4.9,
        author: "Licensed Counselor Team",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-07-25"),
      },
      {
        id: "14",
        title: "Stress Management Workshop",
        category: "therapy",
        price: 75.00,
        stock: 12,
        status: "active",
        sales: 89,
        rating: 4.6,
        author: "Wellness Center",
        createdAt: new Date("2024-04-01"),
        updatedAt: new Date("2024-07-22"),
      },
      {
        id: "15",
        title: "Teen Emergency Contraceptive Guide",
        category: "resources",
        price: 9.99,
        stock: 0,
        status: "inactive",
        sales: 78,
        rating: 4.1,
        author: "Family Planning Clinic",
        createdAt: new Date("2024-03-12"),
        updatedAt: new Date("2024-07-10"),
      },
    ];
  }

  async createProduct(data: Partial<ProductData>): Promise<ProductData> {
    await this.delay(500);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title || "",
      category: data.category || "books",
      price: data.price || 0,
      stock: data.stock || 0,
      status: "active",
      sales: 0,
      rating: 0,
      author: data.author || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export const mockProductsApi = new MockProductsApi();