import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';

interface CartState {
  shopId: string | null;
  shopName: string | null;
  items: CartItem[];
  addItem: (shopId: string, shopName: string, item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// Helper hooks for computed values
export const useTotalItems = () => {
  const items = useCartStore(state => state.items);
  if (!items || !Array.isArray(items)) return 0;
  return items.filter(item => item != null).reduce((sum, item) => sum + item.quantity, 0);
};

export const useTotalAmount = () => {
  const items = useCartStore(state => state.items);
  if (!items || !Array.isArray(items)) return 0;
  return items.filter(item => item != null).reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      shopId: null,
      shopName: null,
      items: [],
      addItem: (shopId, shopName, item) => {
        const state = get();
        
        // Clean up any null items
        const validItems = state.items.filter(i => i != null);
        
        // If cart has items from different shop, clear it
        if (state.shopId && state.shopId !== shopId) {
          if (!confirm('Cart contains items from another shop. Clear cart?')) {
            return;
          }
          set({ shopId, shopName, items: [item] });
          return;
        }
        
        // Check if item exists
        const existingItem = validItems.find(i => i.productId === item.productId);
        if (existingItem) {
          set({
            items: validItems.map(i =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({ shopId, shopName, items: [...validItems, item] });
        }
      },
      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(i => i != null && i.productId !== productId)
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set(state => ({
          items: state.items.filter(i => i != null).map(i =>
            i.productId === productId ? { ...i, quantity } : i
          )
        }));
      },
      clearCart: () => {
        set({ shopId: null, shopName: null, items: [] });
      }
    }),
    { 
      name: 'cart-storage',
      // Clean up corrupted data on rehydration
      onRehydrateStorage: () => (state) => {
        if (state && state.items) {
          state.items = state.items.filter(item => item != null);
        }
      }
    }
  )
);
