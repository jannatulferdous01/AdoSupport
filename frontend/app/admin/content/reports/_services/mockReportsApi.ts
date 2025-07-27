export interface ReportData {
  id: string;
  type:
    | "inappropriate_content"
    | "harassment"
    | "spam"
    | "misinformation"
    | "other";
  status: "pending" | "investigating" | "resolved" | "dismissed";
  priority: "low" | "medium" | "high" | "critical";
  reportedContent: {
    id: string;
    type: "post" | "comment" | "user";
    title: string;
    content: string;
    author: {
      id: string;
      name: string;
      avatar: string;
      role: "adolescent" | "parent" | "expert";
    };
  };
  reporter: {
    id: string;
    name: string;
    avatar: string;
    role: "adolescent" | "parent" | "expert";
  };
  reason: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: {
    id: string;
    name: string;
    avatar: string;
  };
  resolutionNotes?: string;
  moderatorActions?: {
    action: string;
    timestamp: Date;
    moderator: string;
    notes?: string;
  }[];
}

export interface ReportStats {
  total: number;
  pending: number;
  investigating: number;
  resolved: number;
  dismissed: number;
  todaysReports: number;
  avgResolutionTime: number;
  trends: {
    totalChange: number;
    pendingChange: number;
    resolvedChange: number;
  };
}

export interface ReportFilters {
  search?: string;
  status?: ReportData["status"];
  type?: ReportData["type"];
  priority?: ReportData["priority"];
  contentType?: "post" | "comment" | "user";
  reporterRole?: "adolescent" | "parent" | "expert";
  dateRange?: {
    from: Date;
    to: Date;
  };
}

// Mock data
const generateMockReports = (): ReportData[] => {
  const reportTypes: ReportData["type"][] = [
    "inappropriate_content",
    "harassment",
    "spam",
    "misinformation",
    "other",
  ];

  const statuses: ReportData["status"][] = [
    "pending",
    "investigating",
    "resolved",
    "dismissed",
  ];
  const priorities: ReportData["priority"][] = [
    "low",
    "medium",
    "high",
    "critical",
  ];
  const contentTypes: ("post" | "comment" | "user")[] = [
    "post",
    "comment",
    "user",
  ];
  const roles: ("adolescent" | "parent" | "expert")[] = [
    "adolescent",
    "parent",
    "expert",
  ];

  const reports: ReportData[] = [];

  for (let i = 1; i <= 150; i++) {
    const type = reportTypes[Math.floor(Math.random() * reportTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const contentType =
      contentTypes[Math.floor(Math.random() * contentTypes.length)];
    const reporterRole = roles[Math.floor(Math.random() * roles.length)];
    const authorRole = roles[Math.floor(Math.random() * roles.length)];

    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));

    reports.push({
      id: `report-${i}`,
      type,
      status,
      priority,
      reportedContent: {
        id: `content-${i}`,
        type: contentType,
        title:
          contentType === "user"
            ? `User Profile: @user${i}`
            : `${
                contentType === "post" ? "Post" : "Comment"
              }: Sample ${contentType} title ${i}`,
        content: `This is sample ${contentType} content that has been reported for ${type}. Content ID: ${i}`,
        author: {
          id: `author-${i}`,
          name: `Author ${i}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=author${i}`,
          role: authorRole,
        },
      },
      reporter: {
        id: `reporter-${i}`,
        name: `Reporter ${i}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=reporter${i}`,
        role: reporterRole,
      },
      reason: type.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase()),
      description:
        Math.random() > 0.5
          ? `Additional details about the ${type} report. This content violates community guidelines.`
          : undefined,
      createdAt,
      updatedAt: new Date(
        createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
      ),
      assignedTo:
        status !== "pending"
          ? {
              id: `mod-${Math.floor(Math.random() * 5) + 1}`,
              name: `Moderator ${Math.floor(Math.random() * 5) + 1}`,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=mod${
                Math.floor(Math.random() * 5) + 1
              }`,
            }
          : undefined,
      resolutionNotes:
        status === "resolved" || status === "dismissed"
          ? `Report ${status}. ${
              status === "resolved"
                ? "Appropriate action taken."
                : "No violation found."
            }`
          : undefined,
      moderatorActions:
        status !== "pending"
          ? [
              {
                action:
                  status === "investigating"
                    ? "Started investigation"
                    : `Report ${status}`,
                timestamp: new Date(
                  createdAt.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000
                ),
                moderator: `Moderator ${Math.floor(Math.random() * 5) + 1}`,
                notes: `${
                  status === "investigating"
                    ? "Reviewing content and context"
                    : `Action: ${status}`
                }`,
              },
            ]
          : undefined,
    });
  }

  return reports.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const mockReports = generateMockReports();

export const mockReportsApi = {
  fetchReports: async ({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "createdAt",
    sortOrder = "desc",
  }: {
    page?: number;
    limit?: number;
    filters?: ReportFilters;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let filteredReports = [...mockReports];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredReports = filteredReports.filter(
        (report) =>
          report.reportedContent.title.toLowerCase().includes(searchLower) ||
          report.reason.toLowerCase().includes(searchLower) ||
          report.reporter.name.toLowerCase().includes(searchLower) ||
          report.reportedContent.author.name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filteredReports = filteredReports.filter(
        (report) => report.status === filters.status
      );
    }

    if (filters.type) {
      filteredReports = filteredReports.filter(
        (report) => report.type === filters.type
      );
    }

    if (filters.priority) {
      filteredReports = filteredReports.filter(
        (report) => report.priority === filters.priority
      );
    }

    if (filters.contentType) {
      filteredReports = filteredReports.filter(
        (report) => report.reportedContent.type === filters.contentType
      );
    }

    if (filters.reporterRole) {
      filteredReports = filteredReports.filter(
        (report) => report.reporter.role === filters.reporterRole
      );
    }

    // Apply sorting
    filteredReports.sort((a, b) => {
      let aValue: any = a[sortBy as keyof ReportData];
      let bValue: any = b[sortBy as keyof ReportData];

      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    return {
      reports: paginatedReports,
      total: filteredReports.length,
      page,
      limit,
      totalPages: Math.ceil(filteredReports.length / limit),
    };
  },

  fetchReportStats: async (): Promise<ReportStats> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const total = mockReports.length;
    const pending = mockReports.filter((r) => r.status === "pending").length;
    const investigating = mockReports.filter(
      (r) => r.status === "investigating"
    ).length;
    const resolved = mockReports.filter((r) => r.status === "resolved").length;
    const dismissed = mockReports.filter(
      (r) => r.status === "dismissed"
    ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysReports = mockReports.filter(
      (r) => r.createdAt >= today
    ).length;

    return {
      total,
      pending,
      investigating,
      resolved,
      dismissed,
      todaysReports,
      avgResolutionTime: 24,
      trends: {
        totalChange: 12,
        pendingChange: -8,
        resolvedChange: 15,
      },
    };
  },

  fetchReportById: async (id: string): Promise<ReportData> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const report = mockReports.find((r) => r.id === id);
    if (!report) {
      throw new Error("Report not found");
    }

    return report;
  },

  updateReportStatus: async (
    id: string,
    status: ReportData["status"]
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Mock status update
  },

  assignModerator: async (
    reportId: string,
    moderatorId: string
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // Mock assignment
  },
};
