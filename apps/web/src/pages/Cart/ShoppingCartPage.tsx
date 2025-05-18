import React, { useState } from 'react';
import { useShoppingCart } from '../../contexts/ShoppingCartContext';
import { usePurchaseMusic } from '../../hooks/usePurchaseMusic';
import { useAccount } from 'wagmi';

const ShoppingCartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getSubtotal } = useShoppingCart();
  const { isConnected } = useAccount();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'confirmation' | 'success'>('cart');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'ethereum'>('ethereum');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { 
    purchaseTrack, 
    isPurchasing, 
    isConfirming,
    transactionHash 
  } = usePurchaseMusic();
  
  const handleRemoveItem = (trackId: number) => {
    removeFromCart(trackId);
  };
  
  const handleQuantityChange = (trackId: number, newQuantity: number) => {
    updateQuantity(trackId, newQuantity);
  };
  
  const handleCheckout = () => {
    if (!isConnected) {
      setError('Please connect your wallet to proceed with checkout');
      return;
    }
    
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    setCheckoutStep('confirmation');
    setError(null);
  };
  
  const handleConfirmPurchase = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Process one item at a time
      for (const item of items) {
        const priceInEth = item.track.nftPrice.replace('ETH', '').trim();
        
        for (let i = 0; i < item.quantity; i++) {
          await purchaseTrack(item.track.id, priceInEth);
        }
      }
      
      clearCart();
      setCheckoutStep('success');
    } catch (err) {
      console.error('Error during purchase:', err);
      setError('Failed to complete your purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleContinueShopping = () => {
    window.dispatchEvent(new CustomEvent('navigation', { detail: 'marketplace' }));
  };
  
  const renderCartItems = () => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <button
            onClick={handleContinueShopping}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            Browse Marketplace
          </button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.track.id} className="flex items-center bg-background-elevated rounded-lg p-4 border border-background-highlight">
            <img
              src={item.track.image_uri || item.track.albumCover}
              alt={item.track.name || item.track.title}
              className="w-16 h-16 object-cover rounded-md mr-4"
            />
            
            <div className="flex-1">
              <h3 className="font-medium">{item.track.name || item.track.title}</h3>
              <p className="text-sm text-gray-400">{item.track.artist}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs bg-primary/20 text-primary rounded-full px-2 py-0.5 mr-2">
                  {item.track.nftPrice}
                </span>
                <span className="text-xs text-text-secondary">
                  {item.track.licenseType}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mr-4">
              <button
                onClick={() => handleQuantityChange(item.track.id, item.quantity - 1)}
                className="w-6 h-6 flex items-center justify-center bg-background-highlight rounded"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.track.id, item.quantity + 1)}
                className="w-6 h-6 flex items-center justify-center bg-background-highlight rounded"
              >
                +
              </button>
            </div>
            
            <button
              onClick={() => handleRemoveItem(item.track.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    );
  };
  
  const renderCheckoutSummary = () => {
    const subtotal = getSubtotal();
    const fees = subtotal * 0.025; // 2.5% service fee
    const total = subtotal + fees;
    
    return (
      <div className="bg-background-elevated rounded-lg p-4 border border-background-highlight">
        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Subtotal</span>
            <span>{subtotal.toFixed(4)} ETH</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Service Fee (2.5%)</span>
            <span>{fees.toFixed(4)} ETH</span>
          </div>
          <div className="border-t border-background-highlight my-2"></div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{total.toFixed(4)} ETH</span>
          </div>
        </div>
        
        {checkoutStep === 'cart' && (
          <button
            onClick={handleCheckout}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center justify-center"
            disabled={items.length === 0}
          >
            Proceed to Checkout
          </button>
        )}
        
        {checkoutStep === 'confirmation' && (
          <button
            onClick={handleConfirmPurchase}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center justify-center"
            disabled={isLoading || isPurchasing || isConfirming}
          >
            {isLoading || isPurchasing || isConfirming ? (
              <>
                <div className="animate-spin w-5 h-5 border-t-2 border-r-2 border-white rounded-full mr-2"></div>
                Processing...
              </>
            ) : (
              'Confirm Purchase'
            )}
          </button>
        )}
      </div>
    );
  };
  
  const renderConfirmationStep = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Confirm Your Purchase</h2>
        
        <div className="bg-background-elevated rounded-lg p-4 border border-background-highlight mb-6">
          <h3 className="font-medium mb-4">Payment Method</h3>
          
          <div className="space-y-3">
            <div 
              className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                selectedPaymentMethod === 'ethereum' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-background-highlight'
              }`}
              onClick={() => setSelectedPaymentMethod('ethereum')}
            >
              <div className="w-6 h-6 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#627EEA"/>
                  <path d="M16.498 4V12.87L23.995 16.22L16.498 4Z" fill="white" fillOpacity="0.6"/>
                  <path d="M16.498 4L9 16.22L16.498 12.87V4Z" fill="white"/>
                  <path d="M16.498 21.968V27.995L24 17.616L16.498 21.968Z" fill="white" fillOpacity="0.6"/>
                  <path d="M16.498 27.995V21.967L9 17.616L16.498 27.995Z" fill="white"/>
                  <path d="M16.498 20.573L23.995 16.22L16.498 12.872V20.573Z" fill="white" fillOpacity="0.2"/>
                  <path d="M9 16.22L16.498 20.573V12.872L9 16.22Z" fill="white" fillOpacity="0.6"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium">Ethereum</div>
                <div className="text-sm text-gray-400">Pay with ETH from your connected wallet</div>
              </div>
              <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                {selectedPaymentMethod === 'ethereum' && (
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-900/20 border border-yellow-500/50 text-yellow-200 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 mt-1">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <h4 className="font-medium mb-1">Important</h4>
              <p className="text-sm">
                By confirming this purchase, you are agreeing to the license terms for each music NFT.
                Once purchased, these digital assets will be transferred to your wallet.
              </p>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex gap-4">
          <button
            onClick={() => setCheckoutStep('cart')}
            className="px-6 py-2 bg-transparent border border-background-highlight text-white hover:bg-background-highlight rounded-lg transition-colors"
            disabled={isLoading}
          >
            Back to Cart
          </button>
          
          {renderCheckoutSummary()}
        </div>
      </div>
    );
  };
  
  const renderSuccessStep = () => {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Purchase Successful!</h2>
        <p className="text-gray-400 mb-8">
          Your music NFTs have been added to your collection.
        </p>
        
        {transactionHash && (
          <p className="mb-8">
            <a 
              href={`https://etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark transition-colors underline"
            >
              View Transaction Details
            </a>
          </p>
        )}
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigation', { detail: 'library' }))}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            View My Collection
          </button>
          
          <button
            onClick={handleContinueShopping}
            className="px-6 py-2 bg-transparent border border-background-highlight text-white hover:bg-background-highlight rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {checkoutStep === 'cart' && 'Shopping Cart'}
        {checkoutStep === 'confirmation' && 'Checkout'}
        {checkoutStep === 'success' && 'Order Complete'}
      </h1>
      
      {error && checkoutStep === 'cart' && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {checkoutStep === 'cart' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {renderCartItems()}
          </div>
          <div>
            {renderCheckoutSummary()}
          </div>
        </div>
      )}
      
      {checkoutStep === 'confirmation' && renderConfirmationStep()}
      
      {checkoutStep === 'success' && renderSuccessStep()}
    </div>
  );
};

export default ShoppingCartPage;
