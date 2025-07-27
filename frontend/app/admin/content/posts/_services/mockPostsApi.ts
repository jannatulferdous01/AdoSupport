export interface PostData {
  id: string;
  title: string;
  content: string;
  type: "questions" | "discussions" | "resources" | "experiences";
  author: {
    id: string;
    name: string;
    avatar: string;
    age?: number;
    role: "adolescent" | "parent" | "expert";
  };
  status: "published" | "draft" | "reported" | "removed";
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  likes: number;
  commentsCount: number;
  views: number;
  isReported: boolean;
  reportCount: number;
  lastActivityAt: Date;
}

export interface PostComment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: "adolescent" | "parent" | "expert";
  };
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  isReported: boolean;
  parentId?: string;
  replies?: PostComment[];
}

export interface PostStats {
  total: number;
  published: number;
  draft: number;
  reported: number;
  removed: number;
  todaysPosts: number;
  trends: {
    totalChange: number;
    publishedChange: number;
    reportedChange: number;
  };
}

export interface PostFilters {
  search?: string;
  type?: string;
  status?: string;
  author?: string;
  dateRange?: string;
  tags?: string[];
  reported?: boolean;
}

export interface PostsResponse {
  posts: PostData[];
  total: number;
  page: number;
  limit: number;
}

// Mock data generator
const generateMockPosts = (count: number): PostData[] => {
  const types: PostData["type"][] = [
    "questions",
    "discussions",
    "resources",
    "experiences",
  ];
  const statuses: PostData["status"][] = ["published", "draft", "reported"];
  const roles: ("adolescent" | "parent" | "expert")[] = [
    "adolescent",
    "parent",
    "expert",
  ];

  const sampleTitles = [
    "How to deal with anxiety during exams?",
    "Best study techniques for teenagers",
    "Understanding mental health in adolescence",
    "Tips for building self-confidence",
    "Dealing with peer pressure at school",
    "How to communicate with parents better",
    "Managing time between studies and hobbies",
    "Understanding body changes during puberty",
    "Building healthy relationships with friends",
    "Coping with stress and depression",
  ];

  const sampleTags = [
    "mental-health",
    "education",
    "relationships",
    "anxiety",
    "depression",
    "self-care",
    "study-tips",
    "friendship",
    "family",
    "confidence",
  ];

  return Array.from({ length: count }, (_, i) => {
    const createdAt = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    );
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const isReported = Math.random() < 0.1; // 10% chance

    return {
      id: `post_${i + 1}`,
      title: sampleTitles[Math.floor(Math.random() * sampleTitles.length)],
      content: `This is the detailed content for post ${
        i + 1
      }. It contains valuable information and discussion points related to ${type}.`,
      type,
      author: {
        id: `user_${i + 1}`,
        name: `User ${i + 1}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 1}`,
        age:
          role === "adolescent"
            ? 13 + Math.floor(Math.random() * 7)
            : undefined,
        role,
      },
      status: isReported ? "reported" : status,
      createdAt,
      updatedAt: new Date(
        createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
      ),
      tags: sampleTags.slice(0, 2 + Math.floor(Math.random() * 3)),
      likes: Math.floor(Math.random() * 50),
      commentsCount: Math.floor(Math.random() * 20),
      views: Math.floor(Math.random() * 200),
      isReported,
      reportCount: isReported ? Math.floor(Math.random() * 5) + 1 : 0,
      lastActivityAt: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ),
    };
  });
};

const generateMockComments = (postId: string, count: number): PostComment[] => {
  const roles: ("adolescent" | "parent" | "expert")[] = [
    "adolescent",
    "parent",
    "expert",
  ];

  return Array.from({ length: count }, (_, i) => {
    const createdAt = new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
    );
    const role = roles[Math.floor(Math.random() * roles.length)];

    return {
      id: `comment_${postId}_${i + 1}`,
      content: `This is a helpful comment on the post. Comment number ${
        i + 1
      } with valuable insights.`,
      author: {
        id: `commenter_${i + 1}`,
        name: `Commenter ${i + 1}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=commenter${
          i + 1
        }`,
        role,
      },
      createdAt,
      updatedAt: createdAt,
      likes: Math.floor(Math.random() * 10),
      isReported: Math.random() < 0.05, // 5% chance
    };
  });
};

export const mockPostsApi = {
  fetchPosts: async (params: {
    page?: number;
    limit?: number;
    filters?: PostFilters;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PostsResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const {
      page = 1,
      limit = 10,
      filters = {},
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    let allPosts = generateMockPosts(150);

    // Apply filters
    if (filters.search) {
      allPosts = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
          post.content.toLowerCase().includes(filters.search!.toLowerCase()) ||
          post.author.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.type) {
      allPosts = allPosts.filter((post) => post.type === filters.type);
    }

    if (filters.status) {
      allPosts = allPosts.filter((post) => post.status === filters.status);
    }

    if (filters.reported) {
      allPosts = allPosts.filter((post) => post.isReported);
    }

    // Apply sorting
    allPosts.sort((a, b) => {
      let aVal: any = a[sortBy as keyof PostData];
      let bVal: any = b[sortBy as keyof PostData];

      if (aVal instanceof Date) aVal = aVal.getTime();
      if (bVal instanceof Date) bVal = bVal.getTime();

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = allPosts.slice(startIndex, endIndex);

    return {
      posts,
      total: allPosts.length,
      page,
      limit,
    };
  },

  fetchPostById: async (id: string): Promise<PostData | null> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const posts = generateMockPosts(150);
    return posts.find((post) => post.id === id) || null;
  },

  fetchPostComments: async (postId: string): Promise<PostComment[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const commentCount = Math.floor(Math.random() * 15) + 5;
    return generateMockComments(postId, commentCount);
  },

  fetchPostStats: async (): Promise<PostStats> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      total: 12847,
      published: 11234,
      draft: 856,
      reported: 234,
      removed: 523,
      todaysPosts: 47,
      trends: {
        totalChange: 12,
        publishedChange: 8,
        reportedChange: -15,
      },
    };
  },

  updatePostStatus: async (
    postId: string,
    status: PostData["status"]
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In real app, this would update the post status
  },

  deletePost: async (postId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In real app, this would delete the post
  },
};
