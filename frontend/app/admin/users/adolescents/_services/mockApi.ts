"use client";

import { AdolescentUser, UserFilters, UserStats } from "../page";

// Mock data generation
const generateMockUsers = (count: number): AdolescentUser[] => {
  const firstNames = [
    "Alex",
    "Jordan",
    "Taylor",
    "Casey",
    "Morgan",
    "Riley",
    "Avery",
    "Quinn",
    "Jamie",
    "Skyler",
    "Cameron",
    "Drew",
    "Blake",
    "Charlie",
    "Sage",
    "Phoenix",
  ];

  const lastNames = [
    "Johnson",
    "Smith",
    "Brown",
    "Wilson",
    "Davis",
    "Chen",
    "Thompson",
    "Martinez",
    "Parker",
    "Garcia",
    "Lee",
    "Anderson",
    "Rodriguez",
    "Jackson",
    "White",
    "Lopez",
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

    return {
      id: `user-${String(i + 1).padStart(4, "0")}`,
      name,
      email,
      age: Math.floor(Math.random() * 6) + 13, // 13-18 years
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joinDate: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ),
      lastActive: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ),
      location: locations[Math.floor(Math.random() * locations.length)],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(
        " ",
        ""
      )}${i}`,
      parentEmail: Math.random() > 0.2 ? `parent.${email}` : undefined,
      totalPosts: Math.floor(Math.random() * 100),
      warningsCount: Math.floor(Math.random() * 4), // 0-3 warnings
    };
  });
};

// Generate large dataset once
const ALL_USERS = generateMockUsers(2847); // Large dataset for testing

// Simulate API delay
const simulateApiDelay = (min = 300, max = 800) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// Mock API functions that simulate real backend calls
export const mockApi = {
  // Fetch users with pagination and filtering
  async fetchUsers(params: {
    page: number;
    limit: number;
    filters?: UserFilters;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{
    users: AdolescentUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    await simulateApiDelay();

    let filteredUsers = [...ALL_USERS];

    // Apply filters
    if (params.filters) {
      const { search, status, ageRange, dateJoined, location } = params.filters;

      if (search) {
        const searchTerm = search.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
      }

      if (status && status !== "all") {
        filteredUsers = filteredUsers.filter((user) => user.status === status);
      }

      if (ageRange && ageRange !== "all") {
        if (ageRange === "18+") {
          filteredUsers = filteredUsers.filter((user) => user.age >= 18);
        } else {
          const [minAge, maxAge] = ageRange.split("-").map(Number);
          filteredUsers = filteredUsers.filter(
            (user) => user.age >= minAge && user.age <= maxAge
          );
        }
      }

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
          default:
            cutoffDate = new Date(0);
        }

        filteredUsers = filteredUsers.filter(
          (user) => user.joinDate >= cutoffDate
        );
      }

      if (location && location !== "all") {
        filteredUsers = filteredUsers.filter((user) =>
          user.location.toLowerCase().includes(location.toLowerCase())
        );
      }
    }

    // Apply sorting
    if (params.sortBy) {
      filteredUsers.sort((a, b) => {
        let aValue: any = a[params.sortBy as keyof AdolescentUser];
        let bValue: any = b[params.sortBy as keyof AdolescentUser];

        if (aValue instanceof Date) aValue = aValue.getTime();
        if (bValue instanceof Date) bValue = bValue.getTime();

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (params.sortOrder === "desc") {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / params.limit);
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const users = filteredUsers.slice(startIndex, endIndex);

    return {
      users,
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
    };
  },

  // Fetch user statistics
  async fetchUserStats(): Promise<UserStats> {
    await simulateApiDelay(200, 500);

    const total = ALL_USERS.length;
    const active = ALL_USERS.filter((user) => user.status === "active").length;
    const suspended = ALL_USERS.filter(
      (user) => user.status === "suspended"
    ).length;

    // New users this month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const newThisMonth = ALL_USERS.filter(
      (user) => user.joinDate >= oneMonthAgo
    ).length;

    return {
      total,
      active,
      suspended,
      newThisMonth,
      trends: {
        totalChange: Math.floor(Math.random() * 20) - 5, // -5 to +15
        activeChange: Math.floor(Math.random() * 15), // 0 to +15
        suspendedChange: Math.floor(Math.random() * 10) - 5, // -5 to +5
        newChange: Math.floor(Math.random() * 30) + 10, // +10 to +40
      },
    };
  },

  // Fetch single user by ID
  async fetchUserById(id: string): Promise<AdolescentUser | null> {
    await simulateApiDelay(200, 400);
    return ALL_USERS.find((user) => user.id === id) || null;
  },

  // Add stats method for user management dashboard
  fetchAdolescentStats: async (): Promise<{
    total: number;
    active: number;
    suspended: number;
    newThisMonth: number;
    trends: {
      totalChange: number;
      activeChange: number;
      suspendedChange: number;
      newChange: number;
    };
  }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock stats data
    return {
      total: 8542,
      active: 6834,
      suspended: 245,
      newThisMonth: 187,
      trends: {
        totalChange: 15,
        activeChange: 12,
        suspendedChange: -8,
        newChange: 23,
      },
    };
  },

  // Update user status
  async updateUserStatus(
    userId: string,
    status: "active" | "suspended" | "pending"
  ): Promise<AdolescentUser> {
    await simulateApiDelay();

    const userIndex = ALL_USERS.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    ALL_USERS[userIndex] = { ...ALL_USERS[userIndex], status };
    return ALL_USERS[userIndex];
  },

  // Bulk update users
  async bulkUpdateUsers(
    userIds: string[],
    action: "suspend" | "activate" | "delete"
  ): Promise<{ success: number; failed: number }> {
    await simulateApiDelay(1000, 2000);

    let success = 0;
    let failed = 0;

    userIds.forEach((userId) => {
      const userIndex = ALL_USERS.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        if (action === "delete") {
          ALL_USERS.splice(userIndex, 1);
        } else {
          const newStatus = action === "suspend" ? "suspended" : "active";
          ALL_USERS[userIndex] = { ...ALL_USERS[userIndex], status: newStatus };
        }
        success++;
      } else {
        failed++;
      }
    });

    return { success, failed };
  },

  // Export users
  async exportUsers(userIds?: string[]): Promise<{ downloadUrl: string }> {
    await simulateApiDelay(2000, 3000);

    // In real implementation, this would generate and return a download URL
    const exportData = userIds
      ? ALL_USERS.filter((user) => userIds.includes(user.id))
      : ALL_USERS;

    console.log(`Exporting ${exportData.length} users:`, exportData);

    return {
      downloadUrl: "https://example.com/download/users-export.csv",
    };
  },
};

// Backend API functions (commented out for future implementation)
/*
// TODO: Uncomment and implement these functions when backend is ready

export const backendApi = {
  async fetchUsers(params: {
    page: number;
    limit: number;
    filters?: UserFilters;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    users: AdolescentUser[];
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
      ...(params.filters?.ageRange && { ageRange: params.filters.ageRange }),
      ...(params.filters?.dateJoined && { dateJoined: params.filters.dateJoined }),
      ...(params.filters?.location && { location: params.filters.location }),
    });

    const response = await fetch(`/api/users/adolescents?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  async fetchUserStats(): Promise<UserStats> {
    const response = await fetch('/api/users/adolescents/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch user stats');
    }
    return response.json();
  },

  async fetchUserById(id: string): Promise<AdolescentUser | null> {
    const response = await fetch(`/api/users/adolescents/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch user');
    }
    return response.json();
  },

  async updateUserStatus(
    userId: string,
    status: "active" | "suspended" | "pending"
  ): Promise<AdolescentUser> {
    const response = await fetch(`/api/users/adolescents/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update user status');
    }
    return response.json();
  },

  async bulkUpdateUsers(
    userIds: string[],
    action: "suspend" | "activate" | "delete"
  ): Promise<{ success: number; failed: number }> {
    const response = await fetch('/api/users/adolescents/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds, action }),
    });
    if (!response.ok) {
      throw new Error('Failed to perform bulk action');
    }
    return response.json();
  },

  async exportUsers(userIds?: string[]): Promise<{ downloadUrl: string }> {
    const response = await fetch('/api/users/adolescents/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds }),
    });
    if (!response.ok) {
      throw new Error('Failed to export users');
    }
    return response.json();
  }
};
*/
