import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { Track } from './MusicContext.types';

// Moved to separate constant file
const CART_GLOBAL_KEY = "MINTFLIP_GLOBAL_CART";

interface CartItem {
  track: Track;
  quantity: number;
}

interface ShoppingCartContextType {
  items: CartItem[];
  addToCart: (track: Track) => void;
  removeFromCart: (trackId: number) => void;
  clearCart: () => void;
  updateQuantity: (trackId: number, quantity: number) => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

// Define a type for the global function
interface GlobalWindow extends Window {
  [CART_GLOBAL_KEY]?: (track: Track) => boolean;
}

// Provide a default value for the context to avoid null checks
const defaultContextValue: ShoppingCartContextType = {
  items: [],
  addToCart: () => console.warn('ShoppingCartProvider not found'),
  removeFromCart: () => console.warn('ShoppingCartProvider not found'),
  clearCart: () => console.warn('ShoppingCartProvider not found'),
  updateQuantity: () => console.warn('ShoppingCartProvider not found'),
  getItemCount: () => 0,
  getSubtotal: () => 0
};

// Export the context so components can use it directly if needed
export const ShoppingCartContext = createContext<ShoppingCartContextType>(defaultContextValue);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { address } = useAccount();

  // This ensures the addToCart function is accessible globally
  // through the window object for direct access if React events fail
  React.useEffect(() => {
    // Define a global method to add tracks to cart
    const globalAddToCart = (trackToAdd: Track) => {
      console.log("Global addToCart called with track:", trackToAdd);
      
      if (!trackToAdd || !trackToAdd.id) {
        console.error("Invalid track data in global handler:", trackToAdd);
        return false;
      }
      
      setItems(prevItems => {
        // Check if item already exists in cart
        const existingItemIndex = prevItems.findIndex(item => item.track.id === trackToAdd.id);
        
        if (existingItemIndex >= 0) {
          // Item exists, increment quantity
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1
          };
          return updatedItems;
        } else {
          // Item doesn't exist, add it with quantity 1
          return [...prevItems, { track: trackToAdd, quantity: 1 }];
        }
      });
      
      return true; // Indicate success
    };
    
    // Attach to window for global access
    (window as GlobalWindow)[CART_GLOBAL_KEY] = globalAddToCart;
    
    return () => {
      // Cleanup
      delete (window as GlobalWindow)[CART_GLOBAL_KEY];
    };
  }, []);

  // Load cart from localStorage when component mounts or address changes
  useEffect(() => {
    if (address) {
      const savedCart = localStorage.getItem(`mintflip_cart_${address}`);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse saved cart:', e);
        }
      }
    } else {
      // Clear cart when wallet disconnects
      setItems([]);
    }
  }, [address]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (address && items.length > 0) {
      localStorage.setItem(`mintflip_cart_${address}`, JSON.stringify(items));
    } else if (address) {
      localStorage.removeItem(`mintflip_cart_${address}`);
    }
  }, [items, address]);

  const addToCart = (trackToAdd: Track) => {
    if (!trackToAdd || !trackToAdd.id) {
      console.error("Invalid track data:", trackToAdd);
      return;
    }
    
    console.log("ShoppingCartContext: Adding to cart:", trackToAdd);
    
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.track.id === trackToAdd.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add it with quantity 1
        return [...prevItems, { track: trackToAdd, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (trackId: number) => {
    setItems(prevItems => prevItems.filter(item => item.track.id !== trackId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const updateQuantity = (trackId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(trackId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.track.id === trackId ? { ...item, quantity } : item
      )
    );
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => {
      // Convert ETH price string to number
      const price = parseFloat(item.track.nftPrice.replace('ETH', '').trim());
      return total + (price * item.quantity);
    }, 0);
  };

  const contextValue: ShoppingCartContextType = {
    items, 
    addToCart, 
    removeFromCart, 
    clearCart, 
    updateQuantity, 
    getItemCount, 
    getSubtotal
  };

  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

// Separate file recommendation from ESLint isn't practical right now,
// so we'll keep this here but mark it for future refactoring
export const useShoppingCart = () => {
  return useContext(ShoppingCartContext);
};
