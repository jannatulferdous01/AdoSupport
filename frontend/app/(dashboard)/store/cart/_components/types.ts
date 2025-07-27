export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  inStock: boolean;
}

export interface CartItemProps {
  item: CartItem;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

export interface CartItemListProps {
  items: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoApplied: boolean;
  isLoading: boolean;
  applyPromoCode: () => void;
  onCheckout: () => void;
}
