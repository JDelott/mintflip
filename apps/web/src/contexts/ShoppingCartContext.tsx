import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { Track } from './MusicContext.types';

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

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { address } = useAccount();

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

  const addToCart = (track: Track) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.track.id === track.id);
      
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
        return [...prevItems, { track, quantity: 1 }];
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

  return (
    <ShoppingCartContext.Provider 
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        updateQuantity, 
        getItemCount, 
        getSubtotal 
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
  }
  return context;
};
