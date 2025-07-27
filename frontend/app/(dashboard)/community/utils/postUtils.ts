export const getCategoryLabel = (category: string) => {
  switch (category) {
    case "question":
      return "Question";
    case "story":
      return "Success Story";
    case "resource":
      return "Resource";
    default:
      return "Post";
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case "question":
      return "bg-blue-50 text-blue-700";
    case "story":
      return "bg-green-50 text-green-700";
    case "resource":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

export const calculateReadTime = (text: string) => {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime < 1 ? 1 : readTime;
};