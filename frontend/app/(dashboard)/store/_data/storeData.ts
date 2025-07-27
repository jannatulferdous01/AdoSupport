// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  rating: number;
  reviewCount: number;
  category: string;
  tags: string[];
  images: string[];
  isNew: boolean;
  isBestseller: boolean;
  inStock: boolean;
  features?: string[];
  benefits?: string[];
}

// Categories data
export const categories = [
  {
    id: "journals",
    name: "Journals & Workbooks",
    count: 24,
    image:
      "https://images.unsplash.com/photo-1598520106830-8c45c2417d41?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
  },
  {
    id: "stress-relief",
    name: "Stress Relief Tools",
    count: 18,
    image:
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
  },
  {
    id: "mindfulness",
    name: "Mindfulness & Meditation",
    count: 15,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
  },
  {
    id: "self-care",
    name: "Self-Care Kits",
    count: 12,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
  },
  {
    id: "books",
    name: "Books & Resources",
    count: 30,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
  },
  {
    id: "sleep",
    name: "Sleep Support",
    count: 9,
    image:
      "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
  },
  {
    id: "tech",
    name: "Wellness Technology",
    count: 11,
    image:
      "https://images.unsplash.com/photo-1544117519-31a4a39e9a53?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
  },
  {
    id: "parent",
    name: "Parent Resources",
    count: 14,
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
  },
];

// Price ranges for filter
export const priceRanges = [
  { id: "under-15", label: "Under $15", min: 0, max: 15 },
  { id: "15-30", label: "$15 - $30", min: 15, max: 30 },
  { id: "30-50", label: "$30 - $50", min: 30, max: 50 },
  { id: "over-50", label: "Over $50", min: 50, max: Infinity },
];

// Age groups for filter
export const ageGroups = [
  { id: "early-adolescent", label: "Early Adolescent (10-13)" },
  { id: "mid-adolescent", label: "Mid Adolescent (14-16)" },
  { id: "late-adolescent", label: "Late Adolescent (17-19)" },
  { id: "parent", label: "Parents & Caregivers" },
  { id: "professional", label: "Education & Healthcare Professionals" },
];

// Sample products for display
export const products: Product[] = [
  {
    id: "prod-1",
    name: "Teen Mindfulness Journal: 90 Days of Emotional Awareness",
    description:
      "A guided journal specifically designed for teens to build daily mindfulness practice, emotional regulation skills, and self-awareness. Includes prompts, exercises, and tracking tools.",
    price: 24.99,
    discountPrice: 19.99,
    rating: 4.8,
    reviewCount: 127,
    category: "Journals & Workbooks",
    tags: [
      "mindfulness",
      "journal",
      "emotional regulation",
      "bestseller",
      "self-help",
    ],
    images: [
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1598618443855-232ee0f819f6?ixlib=rb-4.0.3",
    ],
    isNew: false,
    isBestseller: true,
    inStock: true,
    features: [
      "90 daily journal prompts focused on teen experiences",
      "Includes emotion tracking and reflection pages",
      "Evidence-based CBT and mindfulness techniques",
      "Durable hardcover with bookmark ribbon",
      "Easy to follow format suitable for ages 13-19",
    ],
    benefits: [
      "Develop healthy coping strategies for stress and anxiety",
      "Build emotional vocabulary and awareness",
      "Create a sustainable mindfulness practice",
      "Track mood patterns and triggers",
      "Improve communication about feelings",
    ],
  },
  {
    id: "prod-2",
    name: "Anxiety Relief Fidget Cube",
    description:
      "A pocket-sized fidget cube with 6 different tactile features designed to help manage anxiety, improve focus and provide sensory input. Perfect for school, home or anywhere.",
    price: 14.95,
    discountPrice: null,
    rating: 4.6,
    reviewCount: 89,
    category: "Anxiety Management",
    tags: ["fidget", "anxiety relief", "sensory", "focus"],
    images: [
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
    ],
    isNew: false,
    isBestseller: false,
    inStock: true,
    features: [
      "6 different fidget features: click, glide, flip, breathe, roll, and spin",
      "Silent operation for classroom use",
      "Compact size fits in pocket or backpack",
      "Durable construction with rounded edges",
      "Non-toxic materials",
    ],
    benefits: [
      "Redirects nervous energy in a non-disruptive way",
      "Provides tactile sensory input for regulation",
      "Helps maintain focus during lectures or study",
      "Portable anxiety management tool",
      "Discreet coping mechanism for stressful situations",
    ],
  },
  {
    id: "prod-3",
    name: "Digital Detox Toolkit for Teens",
    description:
      "A comprehensive kit to help teens balance their relationship with technology. Includes a 30-day detox journal, screen time tracking tools, and alternative activity cards.",
    price: 29.99,
    discountPrice: 24.99,
    rating: 4.5,
    reviewCount: 64,
    category: "Mindfulness Tools",
    tags: ["digital detox", "screen time", "mindfulness", "balance"],
    images: [
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
    ],
    isNew: true,
    isBestseller: false,
    inStock: true,
    features: [
      "30-day guided digital detox journal",
      "Screen time tracking log and goal-setting tools",
      "50 alternative activity cards for offline engagement",
      "Phone parking station",
      "Digital wellness guide for teens and parents",
    ],
    benefits: [
      "Develop healthy boundaries with technology",
      "Reduce anxiety and FOMO from social media",
      "Improve sleep quality and patterns",
      "Increase face-to-face social connections",
      "Discover new interests beyond screens",
    ],
  },
  {
    id: "prod-4",
    name: "Weighted Sensory Lap Pad - 5lbs",
    description:
      "A discrete weighted lap pad that provides calming deep pressure input. Perfect for study time, classroom use, or anytime focus and anxiety reduction is needed.",
    price: 39.99,
    discountPrice: null,
    rating: 4.9,
    reviewCount: 203,
    category: "Sensory Items",
    tags: ["sensory", "anxiety relief", "focus", "classroom"],
    images: [
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
    ],
    isNew: false,
    isBestseller: true,
    inStock: true,
    features: [
      "5lb weight distributed evenly throughout pad",
      "Soft, washable micro-plush cover",
      'Measures 22" x 18" - perfect for lap use',
      "Discreet design resembles standard lap blanket",
      "Hypoallergenic poly-pellet filling",
    ],
    benefits: [
      "Provides calming deep pressure stimulation",
      "Helps reduce anxiety during stressful situations",
      "Improves focus and attention during schoolwork",
      "Assists with emotional regulation",
      "Portable therapeutic tool for home, school or travel",
    ],
  },
  {
    id: "prod-5",
    name: "Parent's Guide to Teen Anxiety",
    description:
      "A comprehensive resource for parents navigating adolescent anxiety. Includes practical strategies, communication tips, and tools to support teens through anxiety challenges.",
    price: 19.95,
    discountPrice: null,
    rating: 4.7,
    reviewCount: 156,
    category: "Parent Resources",
    tags: ["parents", "anxiety", "resource", "communication"],
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
    ],
    isNew: false,
    isBestseller: false,
    inStock: true,
    features: [
      "200-page evidence-based resource",
      "Written by adolescent mental health professionals",
      "Includes parent-teen communication scripts",
      "Contains assessment tools and worksheets",
      "Digital companion resources accessible via QR code",
    ],
    benefits: [
      "Understand the unique nature of adolescent anxiety",
      "Learn effective ways to support without enabling",
      "Improve communication about mental health",
      "Develop a family plan for anxiety management",
      "Recognize when professional help is needed",
    ],
  },
  {
    id: "prod-6",
    name: "Emotion Regulation Card Deck for Teens",
    description:
      "A deck of 52 cards with powerful emotion regulation techniques based on DBT (Dialectical Behavior Therapy) principles, designed specifically for adolescents.",
    price: 16.99,
    discountPrice: null,
    rating: 4.6,
    reviewCount: 72,
    category: "Educational Materials",
    tags: ["DBT", "emotion regulation", "coping skills", "portable"],
    images: [
      "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1610484826967-09c5720778c7?ixlib=rb-4.0.3",
    ],
    isNew: false,
    isBestseller: false,
    inStock: true,
    features: [
      "52 emotion regulation technique cards",
      "4 categories: distress tolerance, mindfulness, emotion regulation, interpersonal effectiveness",
      "Simple, teen-friendly language",
      "Portable size with storage box",
      "Accompanying digital app with expanded content",
    ],
    benefits: [
      "Access practical coping strategies in the moment",
      "Build an emotional regulation toolkit",
      "Learn DBT skills in an accessible format",
      "Practice different techniques to find what works best",
      "Carry support tools discreetly",
    ],
  },
  {
    id: "prod-7",
    name: "Mindful Breathing Necklace",
    description:
      "A stylish and discreet necklace that doubles as a breathing tool for anxiety management. The pendant has a subtle whistle design that helps pace breathing exercises.",
    price: 32.95,
    discountPrice: 27.95,
    rating: 4.3,
    reviewCount: 49,
    category: "Anxiety Management",
    tags: ["breathing", "jewelry", "discrete", "anxiety relief"],
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3",
    ],
    isNew: true,
    isBestseller: false,
    inStock: true,
    features: [
      "Sterling silver pendant with discreet breathing channel",
      '18" adjustable chain',
      "Guides 4-7-8 breathing technique",
      "Comes with instruction card and travel pouch",
      "Water resistant design",
    ],
    benefits: [
      "Practice controlled breathing anywhere discreetly",
      "Keep an anxiety management tool with you at all times",
      "Use during tests, social situations, or any stressful moment",
      "No need to download apps or carry extra items",
      "Fashionable accessory with therapeutic function",
    ],
  },
  {
    id: "prod-8",
    name: "Sleep Better Teen Bundle",
    description:
      "A complete kit designed to help teens establish healthy sleep routines. Includes sleep education materials, tracking tools, and practical sleep aids for better rest.",
    price: 49.99,
    discountPrice: 39.99,
    rating: 4.7,
    reviewCount: 86,
    category: "Mindfulness Tools",
    tags: ["sleep", "routine", "relaxation", "bundle"],
    images: [
      "https://images.unsplash.com/photo-1511068797325-6083f0f872b1?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1471560090527-d1af5e4e6eb6?ixlib=rb-4.0.3",
    ],
    isNew: false,
    isBestseller: false,
    inStock: true,
    features: [
      "Sleep education guide specific to teen biology",
      "30-day sleep tracking journal",
      "Blackout sleep mask with cooling gel insert",
      "Sleep-promoting essential oil roller",
      "Digital twilight mode guide and evening ritual cards",
    ],
    benefits: [
      "Understand teen-specific sleep needs and challenges",
      "Establish healthy sleep hygiene habits",
      "Improve sleep quality and duration",
      "Reduce digital interference with natural sleep cycles",
      "Create sustainable bedtime routines",
    ],
  },
  {
    id: "prod-9",
    name: "Professional Teen Anxiety Assessment Toolkit",
    description:
      "A comprehensive assessment toolkit for mental health professionals working with adolescents. Includes standardized assessment tools, intervention guides, and therapy resources.",
    price: 89.99,
    discountPrice: null,
    rating: 4.9,
    reviewCount: 42,
    category: "Educational Materials",
    tags: ["professional", "assessment", "therapy", "clinical"],
    images: [
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1517817748493-49ec54a32465?ixlib=rb-4.0.3",
    ],
    isNew: false,
    isBestseller: false,
    inStock: true,
    features: [
      "Standardized anxiety screening tools for adolescents",
      "Therapeutic intervention manual with session guides",
      "50 reproducible worksheets and activities",
      "Digital access to assessment scoring tools",
      "Continuing education resource guide",
    ],
    benefits: [
      "Streamline assessment process for teen clients",
      "Access evidence-based intervention strategies",
      "Provide engaging therapeutic activities",
      "Track treatment progress with standardized measures",
      "Support professional development in adolescent care",
    ],
  },
  {
    id: "prod-10",
    name: "Teen Self-Advocacy Workbook",
    description:
      "An interactive workbook helping teens develop skills to advocate for their mental health needs at school, home, and in healthcare settings.",
    price: 18.99,
    discountPrice: null,
    rating: 4.5,
    reviewCount: 57,
    category: "Journals & Workbooks",
    tags: ["self-advocacy", "communication", "empowerment", "workbook"],
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1626197031507-c17099753214?ixlib=rb-4.0.3",
    ],
    isNew: true,
    isBestseller: false,
    inStock: true,
    features: [
      "120-page interactive workbook",
      "Communication templates and scripts",
      "Self-assessment tools for identifying needs",
      "Rights and resources guide for teens",
      "Goal-setting framework for mental health advocacy",
    ],
    benefits: [
      "Develop confidence to speak up about mental health needs",
      "Learn effective communication strategies with adults",
      "Understand rights in school and healthcare settings",
      "Prepare for independent health management",
      "Build self-efficacy and empowerment",
    ],
  },
  {
    id: "prod-11",
    name: "Stress-Less Sensory Putty Set",
    description:
      "A set of four therapeutic putties with different textures and resistances, designed to provide sensory input, stress relief, and hand strengthening benefits.",
    price: 22.95,
    discountPrice: 19.95,
    rating: 4.8,
    reviewCount: 112,
    category: "Sensory Items",
    tags: ["sensory", "fidget", "stress relief", "tactile"],
    images: [
      "https://images.unsplash.com/photo-1595456982104-14cc660c4d22?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1587056590606-997089bc83bd?ixlib=rb-4.0.3",
    ],
    isNew: false,
    isBestseller: false,
    inStock: true,
    features: [
      "4 different resistance levels: soft, medium, firm, extra-firm",
      "Scented options: lavender, citrus, mint, and unscented",
      "Non-toxic, non-sticky formula",
      "Travel containers with secure lids",
      "Includes putty exercise guide",
    ],
    benefits: [
      "Channel nervous energy through tactile stimulation",
      "Improve hand strength and fine motor skills",
      "Practice mindfulness through sensory engagement",
      "Provide calming aromatic therapy with scented options",
      "Portable stress management tool for school or travel",
    ],
  },
  {
    id: "prod-12",
    name: "Parent-Teen Communication Cards",
    description:
      "A card deck designed to facilitate meaningful conversations between parents and teens about difficult topics, including mental health, boundaries, and growing independence.",
    price: 15.99,
    discountPrice: null,
    rating: 4.6,
    reviewCount: 93,
    category: "Parent Resources",
    tags: ["communication", "parents", "conversation", "relationships"],
    images: [
      "https://images.unsplash.com/photo-1558051815-0f18e64e6280?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1558051815-4bd61001c390?ixlib=rb-4.0.3",
    ],
    isNew: false,
    isBestseller: false,
    inStock: true,
    features: [
      "100 conversation starter cards in 5 categories",
      "Discussion guide with communication tips",
      "Reflection questions for both teens and parents",
      "Includes challenging scenario cards with guidance",
      "Digital companion with additional resources",
    ],
    benefits: [
      "Open lines of communication about difficult topics",
      "Build trust and understanding between parents and teens",
      "Practice healthy conflict resolution skills",
      "Create regular opportunities for meaningful connection",
      "Develop emotional intelligence through guided discussions",
    ],
  },
];
