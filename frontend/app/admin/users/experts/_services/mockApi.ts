"use client";

import { ExpertUser, ExpertStats, ExpertFilters } from "../page";

// Mock data generation for expert users
const generateMockExperts = (count: number): ExpertUser[] => {
  const firstNames = [
    "Dr. Sarah",
    "Dr. Michael",
    "Dr. Jennifer",
    "Dr. David",
    "Dr. Lisa",
    "Dr. Robert",
    "Dr. Nancy",
    "Dr. William",
    "Dr. Karen",
    "Dr. James",
    "Dr. Patricia",
    "Dr. Christopher",
    "Dr. Barbara",
    "Dr. Matthew",
    "Dr. Elizabeth",
    "Dr. Anthony",
    "Dr. Mary",
    "Dr. Mark",
    "Dr. Susan",
    "Dr. Joseph",
  ];

  const lastNames = [
    "Johnson",
    "Smith",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
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
  ];

  const specialties = [
    "psychology",
    "psychiatry",
    "counseling",
    "therapy",
    "social-work",
    "education",
  ];

  const qualificationOptions = [
    "PhD in Psychology",
    "MD Psychiatry",
    "Licensed Clinical Social Worker",
    "Master's in Counseling",
    "Board Certified",
    "Child Psychology Specialist",
    "Trauma Therapy Certified",
    "Cognitive Behavioral Therapy",
    "Family Therapy",
    "Adolescent Specialist",
    "Licensed Professional Counselor",
    "PhD in Education",
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
  const availabilities: ("available" | "busy" | "offline")[] = [
    "available",
    "busy",
    "offline",
  ];

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName
      .toLowerCase()
      .replace("dr. ", "")}.${lastName.toLowerCase()}@example.com`;

    const areaCode = Math.floor(Math.random() * 800) + 200;
    const exchange = Math.floor(Math.random() * 800) + 200;
    const number = Math.floor(Math.random() * 9000) + 1000;

    // Random qualifications (2-4 per expert)
    const numQualifications = Math.floor(Math.random() * 3) + 2;
    const qualifications: any = [];
    for (let j = 0; j < numQualifications; j++) {
      const qual =
        qualificationOptions[
          Math.floor(Math.random() * qualificationOptions.length)
        ];
      if (!qualifications.includes(qual)) {
        qualifications.push(qual);
      }
    }

    return {
      id: `expert-${String(i + 1).padStart(4, "0")}`,
      name,
      email,
      phone: `+1 (${areaCode}) ${exchange}-${number}`,
      specialty: specialties[Math.floor(Math.random() * specialties.length)],
      experience: Math.floor(Math.random() * 20) + 1, // 1-20 years
      qualifications,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joinDate: new Date(
        Date.now() - Math.random() * 1095 * 24 * 60 * 60 * 1000
      ), // Up to 3 years ago
      lastActive: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ), // Within last week
      location: locations[Math.floor(Math.random() * locations.length)],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(
        /\s+/g,
        ""
      )}expert${i}`,
      totalSessions: Math.floor(Math.random() * 500), // 0-499 sessions
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0 rating
      hourlyRate: Math.floor(Math.random() * 150) + 50, // $50-200 per hour
      availability:
        availabilities[Math.floor(Math.random() * availabilities.length)],
    };
  });
};

// Generate dataset for testing
const ALL_EXPERTS = generateMockExperts(543);

// Simulate API delay
const simulateApiDelay = (min = 300, max = 800) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// Mock API functions
export const mockApi = {
  // Fetch experts with pagination and filtering
  async fetchExperts(params: {
    page: number;
    limit: number;
    filters?: ExpertFilters;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{
    experts: ExpertUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    await simulateApiDelay();

    let filteredExperts = [...ALL_EXPERTS];

    // Apply filters
    if (params.filters) {
      const {
        search,
        status,
        specialty,
        experience,
        availability,
        location,
        rating,
        dateJoined,
      } = params.filters;

      if (search && search.trim() !== "") {
        const searchTerm = search.toLowerCase().trim();
        filteredExperts = filteredExperts.filter(
          (expert) =>
            expert.name.toLowerCase().includes(searchTerm) ||
            expert.email.toLowerCase().includes(searchTerm) ||
            expert.specialty.toLowerCase().includes(searchTerm) ||
            expert.qualifications.some((q) =>
              q.toLowerCase().includes(searchTerm)
            )
        );
      }

      if (status && status !== "all") {
        filteredExperts = filteredExperts.filter(
          (expert) => expert.status === status
        );
      }

      if (specialty && specialty !== "all") {
        filteredExperts = filteredExperts.filter(
          (expert) => expert.specialty === specialty
        );
      }

      if (experience && experience !== "all") {
        if (experience === "0-2") {
          filteredExperts = filteredExperts.filter(
            (expert) => expert.experience <= 2
          );
        } else if (experience === "3-5") {
          filteredExperts = filteredExperts.filter(
            (expert) => expert.experience >= 3 && expert.experience <= 5
          );
        } else if (experience === "6-10") {
          filteredExperts = filteredExperts.filter(
            (expert) => expert.experience >= 6 && expert.experience <= 10
          );
        } else if (experience === "10+") {
          filteredExperts = filteredExperts.filter(
            (expert) => expert.experience > 10
          );
        }
      }

      if (availability && availability !== "all") {
        filteredExperts = filteredExperts.filter(
          (expert) => expert.availability === availability
        );
      }

      if (location && location !== "all") {
        filteredExperts = filteredExperts.filter((expert) =>
          expert.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (rating && rating !== "all") {
        const minRating = parseInt(rating.replace("+", ""));
        filteredExperts = filteredExperts.filter(
          (expert) => expert.rating >= minRating
        );
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
          case "year":
            cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            cutoffDate = new Date(0);
        }

        filteredExperts = filteredExperts.filter(
          (expert) => expert.joinDate >= cutoffDate
        );
      }
    }

    // Apply sorting
    if (params.sortBy) {
      filteredExperts.sort((a, b) => {
        let aValue: any = a[params.sortBy as keyof ExpertUser];
        let bValue: any = b[params.sortBy as keyof ExpertUser];

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
    const total = filteredExperts.length;
    const totalPages = Math.ceil(total / params.limit) || 1;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const experts = filteredExperts.slice(startIndex, endIndex);

    return {
      experts,
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
    };
  },

  // Add stats method for user management dashboard
  fetchExpertStats: async (): Promise<{
    total: number;
    active: number;
    suspended: number;
    newThisMonth: number;
    avgRating: number;
    totalSessions: number;
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
      total: 1474,
      active: 950,
      suspended: 89,
      newThisMonth: 39,
      avgRating: 4.6,
      totalSessions: 25847,
      trends: {
        totalChange: 22,
        activeChange: 18,
        suspendedChange: -12,
        newChange: 31,
      },
    };
  },

  // Fetch single expert by ID
  async fetchExpertById(id: string): Promise<ExpertUser | null> {
    await simulateApiDelay(200, 400);
    return ALL_EXPERTS.find((expert) => expert.id === id) || null;
  },

  // Create new expert
  async createExpert(expertData: Partial<ExpertUser>): Promise<ExpertUser> {
    await simulateApiDelay(1000, 1500);

    const newExpert: ExpertUser = {
      id: `expert-${String(ALL_EXPERTS.length + 1).padStart(4, "0")}`,
      name: expertData.name || "",
      email: expertData.email || "",
      phone: expertData.phone || "",
      specialty: expertData.specialty || "",
      experience: expertData.experience || 0,
      qualifications: expertData.qualifications || [],
      status: "pending",
      joinDate: new Date(),
      lastActive: new Date(),
      location: expertData.location || "",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${expertData.name?.replace(
        /\s+/g,
        ""
      )}`,
      totalSessions: 0,
      rating: 0,
      hourlyRate: expertData.hourlyRate || 0,
      availability: "offline",
    };

    ALL_EXPERTS.push(newExpert);
    return newExpert;
  },

  // Update expert status
  async updateExpertStatus(
    expertId: string,
    status: "active" | "suspended" | "pending"
  ): Promise<ExpertUser> {
    await simulateApiDelay();

    const expertIndex = ALL_EXPERTS.findIndex(
      (expert) => expert.id === expertId
    );
    if (expertIndex === -1) {
      throw new Error("Expert not found");
    }

    ALL_EXPERTS[expertIndex] = { ...ALL_EXPERTS[expertIndex], status };
    return ALL_EXPERTS[expertIndex];
  },

  // Bulk update experts
  async bulkUpdateExperts(
    expertIds: string[],
    action: "suspend" | "activate" | "delete"
  ): Promise<{ success: number; failed: number }> {
    await simulateApiDelay(1000, 2000);

    let success = 0;
    let failed = 0;

    expertIds.forEach((expertId) => {
      const expertIndex = ALL_EXPERTS.findIndex(
        (expert) => expert.id === expertId
      );

      if (expertIndex !== -1) {
        if (action === "delete") {
          ALL_EXPERTS.splice(expertIndex, 1);
        } else {
          const newStatus = action === "suspend" ? "suspended" : "active";
          ALL_EXPERTS[expertIndex] = {
            ...ALL_EXPERTS[expertIndex],
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

  // Export experts
  async exportExperts(expertIds?: string[]): Promise<{ downloadUrl: string }> {
    await simulateApiDelay(2000, 3000);

    const exportData = expertIds
      ? ALL_EXPERTS.filter((expert) => expertIds.includes(expert.id))
      : ALL_EXPERTS;

    console.log(`Exporting ${exportData.length} expert users:`, {
      totalExperts: exportData.length,
      exportedData: exportData.slice(0, 3),
      timestamp: new Date().toISOString(),
    });

    return {
      downloadUrl: "https://example.com/download/experts-export.csv",
    };
  },
};
