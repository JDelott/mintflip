import React from 'react';
import { useShoppingCart } from '../../contexts/ShoppingCartContext';

interface CartIconProps {
  onClick?: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick }) => {
  const { getItemCount } = useShoppingCart();
  const itemCount = getItemCount();
  
  return (
    <button 
      className="relative flex items-center text-text-secondary hover:text-white transition-colors"
      onClick={onClick}
      aria-label="Shopping Cart"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      <span className="ml-3">Cart</span>
      
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
