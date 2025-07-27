import { PostProps } from "../_components/Post/Post";

export const getMockPosts = (): PostProps[] => {
  return [
    {
      id: "post-1",
      author: {
        id: "user-1",
        name: "Jane Smith",
        image: "/assets/images/avatars/avatar-1.png",
        role: "adolescent",
      },
      content: {
        title: "How do you deal with test anxiety?",
        text: "I have a big exam coming up and I always freeze during tests even when I know the material. Anyone have techniques that actually work for managing test anxiety?",
      },
      category: "question",
      createdAt: new Date(Date.now() - 3600000),
      commentCount: 7,
      reactions: {
        likes: 5,
        helpful: 0,
        support: 12,
      },
      tags: ["anxiety", "school", "stress"],
    },
    {
      id: "post-2",
      author: {
        id: "expert1",
        name: "Dr. Sarah Johnson",
        image: "/assets/images/avatars/avatar-2.png",
        isExpert: true,
        role: "therapist",
      },
      content: {
        title: "Weekly Mindfulness Exercise: Thought Clouds",
        text: "Today I'm sharing a visualization technique that can help with overwhelming thoughts. Imagine your thoughts as clouds in the sky. You're not the clouds, you're the sky - vast and unchanging. The clouds (thoughts) are temporary visitors that come and go.\n\nPractice this for 5 minutes each day: sit comfortably, close your eyes, and watch your thoughts pass by like clouds. Don't judge them or try to hold onto them, just observe them floating by.",
        image:
          "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
      },
      category: "resource",
      createdAt: new Date(Date.now() - 86400000),
      commentCount: 15,
      reactions: {
        likes: 42,
        helpful: 38,
        support: 5,
      },
      tags: ["mindfulness", "anxiety", "technique"],
    },
    {
      id: "post-3",
      author: {
        id: "user2",
        name: "Alex Taylor",
        image: "/assets/images/avatars/avatar-3.png",
        role: "adolescent",
      },
      content: {
        title: "I finally spoke up in class today!",
        text: "After months of working on my social anxiety, I finally raised my hand and answered a question in class today. My heart was racing but I did it! My voice only shook a little bit. This is a huge win for me and I wanted to share with people who understand.",
      },
      category: "story",
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      commentCount: 23,
      reactions: {
        likes: 56,
        helpful: 12,
        support: 38,
      },
      tags: ["success", "socialanxiety", "school"],
    },
    {
      id: "post-4",
      author: {
        id: "user3",
        name: "Jordan Kim",
        image: "/assets/images/avatars/avatar-4.png",
        role: "parent",
      },
      content: {
        text: "Does anyone have recommendations for how to talk to my teen about therapy? They've been struggling with what seems like depression, but they shut down every time I bring up getting help.",
      },
      category: "question",
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      commentCount: 18,
      reactions: {
        likes: 4,
        helpful: 9,
        support: 15,
      },
      tags: ["parenting", "communication", "therapy"],
    },
    {
      id: "post-5",
      author: {
        id: "expert2",
        name: "Marcus Williams",
        image: "/assets/images/avatars/avatar-5.png",
        isExpert: true,
        role: "psychologist",
      },
      content: {
        title: "Resource: Free Teen Mental Health Workbook",
        text: "I've just published a free workbook specifically designed for teens dealing with anxiety and depression. It contains 25 exercises based on CBT techniques that have proven helpful with my younger clients.\n\nYou can download it from the link in the first comment. Feel free to share this resource with anyone who might benefit.",
      },
      category: "resource",
      createdAt: new Date(Date.now() - 432000000), // 5 days ago
      commentCount: 32,
      reactions: {
        likes: 89,
        helpful: 76,
        support: 14,
      },
      tags: ["resource", "workbook", "cbt", "depression"],
    },
  ];
};

export const topicsList = [
  "anxiety",
  "depression",
  "stress",
  "school",
  "social",
  "family",
  "relationships",
  "selfcare",
  "therapy",
  "mindfulness",
  "communication",
  "parenting",
];

export const mockExperts = [
  {
    id: "expert1",
    name: "Dr. Sarah Johnson",
    image: "/assets/images/avatars/avatar-2.png",
    role: "Adolescent Therapist",
    specialties: ["anxiety", "depression", "trauma"],
    bio: "Specializing in adolescent mental health for over 15 years. I use an integrative approach combining CBT, DBT, and mindfulness-based strategies.",
  },
  {
    id: "expert2",
    name: "Marcus Williams",
    image: "/assets/images/avatars/avatar-5.png",
    role: "Clinical Psychologist",
    specialties: ["academic stress", "family therapy", "behavior management"],
    bio: "Working with teens and families to develop practical strategies for managing life's challenges. My focus is on building resilience and healthy coping skills.",
  },
  {
    id: "expert3",
    name: "Dr. Emily Chen",
    image: "/assets/images/avatars/avatar-6.png",
    role: "Child & Adolescent Psychiatrist",
    specialties: ["mood disorders", "ADHD", "anxiety disorders"],
    bio: "Board-certified psychiatrist specializing in evidence-based treatment for children and adolescents. I believe in a holistic approach to mental health.",
  },
];

export const mockLiveSessions = [
  {
    id: "session1",
    title: "Managing Exam Stress",
    expert: mockExperts[0],
    date: new Date(Date.now() + 86400000 * 3), // 3 days from now
    description:
      "Learn practical techniques to manage test anxiety and perform your best under pressure.",
    registeredCount: 24,
  },
  {
    id: "session2",
    title: "Healthy Communication for Families",
    expert: mockExperts[1],
    date: new Date(Date.now() + 86400000 * 5), // 5 days from now
    description:
      "Discover strategies for parents and teens to communicate effectively even during conflicts.",
    registeredCount: 36,
  },
  {
    id: "session3",
    title: "Understanding Depression in Adolescents",
    expert: mockExperts[2],
    date: new Date(Date.now() + 86400000 * 10), // 10 days from now
    description:
      "Signs, symptoms, and supportive approaches for teens experiencing depression.",
    registeredCount: 42,
  },
];
