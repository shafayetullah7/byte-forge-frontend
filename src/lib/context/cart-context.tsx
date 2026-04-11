import { createContext, useContext, createSignal, createEffect, onMount, type ParentComponent } from 'solid-js';
import { apiClient } from '~/lib/api/api-client';

export interface CartItem {
  id: string;
  quantity: number;
  plantVariant: {
    id: string;
    plantId: string;
  };
  plant: {
    id: string;
    name: string;
    slug: string;
    thumbnailId: string | null;
  };
  shop: {
    id: string;
    slug: string;
  } | null;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (plantVariantId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>();

export const CartProvider: ParentComponent = (props) => {
  const [cart, setCart] = createSignal<Cart | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  const refreshCart = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<Cart>('/cart');
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (plantVariantId: string, quantity: number) => {
    try {
      await apiClient.post('/cart/items', { plantVariantId, quantity });
      await refreshCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await apiClient.patch(`/cart/items/${itemId}`, { quantity });
      await refreshCart();
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await apiClient.delete(`/cart/items/${itemId}`);
      await refreshCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await apiClient.delete('/cart');
      setCart({ items: [], totalItems: 0 });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  onMount(() => {
    refreshCart();
  });

  return (
    <CartContext.Provider
      value={{
        cart: cart(),
        isLoading: isLoading(),
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
