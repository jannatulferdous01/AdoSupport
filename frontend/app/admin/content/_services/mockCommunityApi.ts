export interface CommunityStatsData {
  postTypes: {
    questions: {
      total: number;
      answered: number;
      unanswered: number;
      reported: number;
    };
    discussions: {
      total: number;
      active: number;
      closed: number;
      reported: number;
    };
    resources: {
      total: number;
      published: number;
      draft: number;
      reported: number;
    };
    experiences: {
      total: number;
      approved: number;
      pending: number;
      reported: number;
    };
  };
  engagement: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    activeUsers: number;
  };
  moderation: {
    totalReports: number;
    pending: number;
    resolved: number;
    dismissed: number;
  };
  trends: {
    questionsChange: number;
    discussionsChange: number;
    resourcesChange: number;
    experiencesChange: number;
    engagementChange: number;
    moderationChange: number;
  };
}

export const mockCommunityApi = {
  fetchCommunityStats: async (): Promise<CommunityStatsData> => {
    // Simulate API delay - feels more realistic
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return {
      postTypes: {
        questions: {
          total: 3247,
          answered: 2891,
          unanswered: 356,
          reported: 12,
        },
        discussions: {
          total: 5683,
          active: 4521,
          closed: 1162,
          reported: 18,
        },
        resources: {
          total: 1892,
          published: 1743,
          draft: 149,
          reported: 8,
        },
        experiences: {
          total: 2025,
          approved: 1834,
          pending: 191,
          reported: 15,
        },
      },
      engagement: {
        totalViews: 125847,
        totalLikes: 34592,
        totalComments: 18764,
        activeUsers: 2847,
      },
      moderation: {
        totalReports: 53,
        pending: 23,
        resolved: 28,
        dismissed: 2,
      },
      trends: {
        questionsChange: 12,
        discussionsChange: 8,
        resourcesChange: 15,
        experiencesChange: 22,
        engagementChange: 18,
        moderationChange: -12,
      },
    };
  },
};
