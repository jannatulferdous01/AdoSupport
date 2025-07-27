export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Sample cart items for the demo
export const sampleCartItems: CartItem[] = [
  {
    id: "1",
    name: "Teen Mindfulness Journal: 90 Days of Emotional Awareness",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    quantity: 1,
  },
  {
    id: "2",
    name: "Stress Relief Fidget Cube for Anxiety Management",
    price: 14.95,
    image:
      "https://images.unsplash.com/photo-1591017683260-c0cbf29c7c72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    quantity: 2,
  },
];