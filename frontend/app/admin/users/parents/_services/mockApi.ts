"use client";

import { ParentUser, ParentStats, ParentFilters } from "../page";

// Mock data generation for parent users
const generateMockParents = (count: number): ParentUser[] => {
  const firstNames = [
    "Michael",
    "Sarah",
    "David",
    "Jennifer",
    "Robert",
    "Lisa",
    "William",
    "Nancy",
    "James",
    "Karen",
    "John",
    "Betty",
    "Richard",
    "Helen",
    "Charles",
    "Sandra",
    "Christopher",
    "Patricia",
    "Daniel",
    "Barbara",
    "Matthew",
    "Elizabeth",
    "Anthony",
    "Mary",
  ];

  const lastNames = [
    "Johnson",
    "Smith",
    "Brown",
    "Wilson",
    "Davis",
    "Miller",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Martinez",
    "Robinson",
    "Clark",
    "Rodriguez",
    "Lewis",
    "Lee",
    "Walker",
    "Hall",
  ];

  const locations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
    "Austin, TX",
    "Jacksonville, FL",
    "Fort Worth, TX",
    "Columbus, OH",
    "Charlotte, NC",
    "San Francisco, CA",
    "Indianapolis, IN",
    "Seattle, WA",
    "Denver, CO",
    "Washington, DC",
  ];

  const statuses: ("active" | "suspended" | "pending")[] = [
    "active",
    "suspended",
    "pending",
  ];

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${
      i > 50 ? i : ""
    }@example.com`;

    // Generate realistic phone numbers
    const areaCode = Math.floor(Math.random() * 800) + 200;
    const exchange = Math.floor(Math.random() * 800) + 200;
    const number = Math.floor(Math.random() * 9000) + 1000;

    return {
      id: `parent-${String(i + 1).padStart(4, "0")}`,
      name,
      email,
      phone: `+1 (${areaCode}) ${exchange}-${number}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joinDate: new Date(
        Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000
      ), // Up to 2 years ago
      lastActive: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ), // Within last 30 days
      location: locations[Math.floor(Math.random() * locations.length)],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(
        " ",
        ""
      )}parent${i}`,
      childrenCount: Math.floor(Math.random() * 4) + 1, // 1-4 children
      totalOrders: Math.floor(Math.random() * 25), // 0-24 orders
    };
  });
};

// Generate large dataset for testing pagination
const ALL_PARENTS = generateMockParents(1847); // Realistic dataset size

// Simulate API delay for realistic experience
const simulateApiDelay = (min = 300, max = 800) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// Mock API functions that simulate real backend calls
export const mockApi = {
  // Fetch parents with pagination and filtering
  async fetchParents(params: {
    page: number;
    limit: number;
    filters?: ParentFilters;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{
    parents: ParentUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    await simulateApiDelay();

    let filteredParents = [...ALL_PARENTS];

    // Apply search and filter logic
    if (params.filters) {
      const { search, status, verificationStatus, childrenCount, dateJoined, location } = params.filters;

      // Search functionality - search across name, email, and phone
      if (search && search.trim() !== "" && search !== "all") {
        const searchTerm = search.toLowerCase().trim();
        filteredParents = filteredParents.filter(
          (parent) =>
            parent.name.toLowerCase().includes(searchTerm) ||
            parent.email.toLowerCase().includes(searchTerm) ||
            parent.phone.toLowerCase().includes(searchTerm)
        );
      }

      // Status filter
      if (status && status !== "all") {
        // Map 'inactive' filter to 'suspended' status in data
        const filterStatus = status === "inactive" ? "suspended" : status;
        filteredParents = filteredParents.filter(
          (parent) => parent.status === filterStatus
        );
      }

      // Verification status filter (mock - we'll just randomly filter some users)
      if (verificationStatus && verificationStatus !== "all") {
        if (verificationStatus === "verified") {
          filteredParents = filteredParents.filter((_, index) => index % 3 === 0);
        } else if (verificationStatus === "pending") {
          filteredParents = filteredParents.filter((_, index) => index % 3 === 1);
        } else if (verificationStatus === "unverified") {
          filteredParents = filteredParents.filter((_, index) => index % 3 === 2);
        }
      }

      // Children count filter
      if (childrenCount && childrenCount !== "all") {
        if (childrenCount === "1") {
          filteredParents = filteredParents.filter(
            (parent) => parent.childrenCount === 1
          );
        } else if (childrenCount === "2-3") {
          filteredParents = filteredParents.filter(
            (parent) => parent.childrenCount >= 2 && parent.childrenCount <= 3
          );
        } else if (childrenCount === "4+") {
          filteredParents = filteredParents.filter(
            (parent) => parent.childrenCount >= 4
          );
        }
      }

      // Date joined filter
      if (dateJoined && dateJoined !== "all") {
        const now = new Date();
        let cutoffDate: Date;

        switch (dateJoined) {
          case "today":
            cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case "week":
            cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "month":
            cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case "quarter":
            cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case "year":
            cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            cutoffDate = new Date(0);
        }

        filteredParents = filteredParents.filter(
          (parent) => parent.joinDate >= cutoffDate
        );
      }

      // Location filter
      if (location && location !== "all") {
        filteredParents = filteredParents.filter((parent) =>
          parent.location.toLowerCase().includes(location.toLowerCase())
        );
      }
    }

    // Apply sorting logic
    if (params.sortBy) {
      filteredParents.sort((a, b) => {
        let aValue: any = a[params.sortBy as keyof ParentUser];
        let bValue: any = b[params.sortBy as keyof ParentUser];

        // Handle Date objects
        if (aValue instanceof Date) aValue = aValue.getTime();
        if (bValue instanceof Date) bValue = bValue.getTime();

        // Handle string comparisons
        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        // Apply sort direction
        if (params.sortOrder === "desc") {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    const total = filteredParents.length;
    const totalPages = Math.ceil(total / params.limit) || 1;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const parents = filteredParents.slice(startIndex, endIndex);

    return {
      parents,
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
    };
  },

  // Add stats method for user management dashboard
  fetchParentStats: async (): Promise<{
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    trends: {
      totalChange: number;
      activeChange: number;
      inactiveChange: number;
      newChange: number;
    };
  }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock stats data
    return {
      total: 5831,
      active: 4672,
      inactive: 1159,
      newThisMonth: 98,
      trends: {
        totalChange: 8,
        activeChange: 10,
        inactiveChange: -5,
        newChange: 18,
      },
    };
  },

  // Fetch single parent by ID
  async fetchParentById(id: string): Promise<ParentUser | null> {
    await simulateApiDelay(200, 400);
    return ALL_PARENTS.find((parent) => parent.id === id) || null;
  },

  // Update parent status
  async updateParentStatus(
    parentId: string,
    status: "active" | "suspended" | "pending"
  ): Promise<ParentUser> {
    await simulateApiDelay();

    const parentIndex = ALL_PARENTS.findIndex(
      (parent) => parent.id === parentId
    );

    if (parentIndex === -1) {
      throw new Error("Parent user not found");
    }

    // Update the parent status in our mock database
    ALL_PARENTS[parentIndex] = { ...ALL_PARENTS[parentIndex], status };
    return ALL_PARENTS[parentIndex];
  },

  // Bulk update multiple parents
  async bulkUpdateParents(
    parentIds: string[],
    action: "suspend" | "activate" | "delete"
  ): Promise<{ success: number; failed: number }> {
    await simulateApiDelay(1000, 2000); // Longer delay for bulk operations

    let success = 0;
    let failed = 0;

    parentIds.forEach((parentId) => {
      const parentIndex = ALL_PARENTS.findIndex(
        (parent) => parent.id === parentId
      );

      if (parentIndex !== -1) {
        if (action === "delete") {
          // Remove parent from mock database
          ALL_PARENTS.splice(parentIndex, 1);
        } else {
          // Update parent status
          const newStatus = action === "suspend" ? "suspended" : "active";
          ALL_PARENTS[parentIndex] = {
            ...ALL_PARENTS[parentIndex],
            status: newStatus,
          };
        }
        success++;
      } else {
        failed++;
      }
    });

    return { success, failed };
  },

  // Export parents functionality
  async exportParents(parentIds?: string[]): Promise<{ downloadUrl: string }> {
    await simulateApiDelay(2000, 3000); // Longer delay for export operations

    // Determine which parents to export
    const exportData = parentIds
      ? ALL_PARENTS.filter((parent) => parentIds.includes(parent.id))
      : ALL_PARENTS;

    // Log export details for development
    console.log(`Exporting ${exportData.length} parent users:`, {
      totalParents: exportData.length,
      exportedData: exportData.slice(0, 3), // Show first 3 for demo
      timestamp: new Date().toISOString(),
    });

    return {
      downloadUrl: "https://example.com/download/parents-export.csv",
    };
  },
};

// Backend API functions (commented out for future implementation)
/*
// TODO: Uncomment and implement these functions when backend is ready
// These functions follow the exact same interface as the mock API above

export const backendApi = {
  // Fetch parents with pagination and filtering
  async fetchParents(params: {
    page: number;
    limit: number;
    filters?: ParentFilters;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    parents: ParentUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortOrder && { sortOrder: params.sortOrder }),
      ...(params.filters?.search && { search: params.filters.search }),
      ...(params.filters?.status && { status: params.filters.status }),
      ...(params.filters?.verificationStatus && { verificationStatus: params.filters.verificationStatus }),
      ...(params.filters?.childrenCount && { childrenCount: params.filters.childrenCount }),
      ...(params.filters?.dateJoined && { dateJoined: params.filters.dateJoined }),
      ...(params.filters?.location && { location: params.filters.location }),
    });

    const response = await fetch(`/api/users/parents?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch parent users');
    }
    
    return response.json();
  },

  // Fetch parent user statistics
  async fetchParentStats(): Promise<ParentStats> {
    const response = await fetch('/api/users/parents/stats', {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch parent statistics');
    }
    
    return response.json();
  },

  // Fetch single parent by ID
  async fetchParentById(id: string): Promise<ParentUser | null> {
    const response = await fetch(`/api/users/parents/${id}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch parent user');
    }
    
    return response.json();
  },

  // Update parent status
  async updateParentStatus(
    parentId: string,
    status: "active" | "suspended" | "pending"
  ): Promise<ParentUser> {
    const response = await fetch(`/api/users/parents/${parentId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update parent status');
    }
    
    return response.json();
  },

  // Bulk update multiple parents
  async bulkUpdateParents(
    parentIds: string[],
    action: "suspend" | "activate" | "delete"
  ): Promise<{ success: number; failed: number }> {
    const response = await fetch('/api/users/parents/bulk', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parentIds, action }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to perform bulk action on parents');
    }
    
    return response.json();
  },

  // Export parents functionality
  async exportParents(parentIds?: string[]): Promise<{ downloadUrl: string }> {
    const response = await fetch('/api/users/parents/export', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parentIds }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to export parent users');
    }
    
    return response.json();
  }
};

// Helper function to get auth token (implement based on your auth system)
function getAuthToken(): string {
  // Implementation depends on how you store auth tokens
  // Could be from localStorage, cookies, or Redux store
  return localStorage.getItem('authToken') || '';
}
*/
