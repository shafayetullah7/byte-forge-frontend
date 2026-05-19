import { createContext, useContext, createSignal, onMount, type ParentComponent } from "solid-js";
import { cartApi, invalidateCart } from "~/lib/api";
import type { Cart } from "~/lib/api/types/cart.types";

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
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
      const data = await cartApi.get();
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (variantId: string, quantity: number) => {
    try {
      await cartApi.add({ variantId, quantity });
      await invalidateCart();
      await refreshCart();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await cartApi.updateItem(itemId, { quantity });
      await invalidateCart();
      await refreshCart();
    } catch (error) {
      console.error("Failed to update cart:", error);
      throw error;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await cartApi.removeItem(itemId);
      await invalidateCart();
      await refreshCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      await invalidateCart();
      setCart({ items: [], itemsCount: 0, totalQuantity: 0, subtotal: "0", id: "", createdAt: "", updatedAt: "" });
    } catch (error) {
      console.error("Failed to clear cart:", error);
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
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
