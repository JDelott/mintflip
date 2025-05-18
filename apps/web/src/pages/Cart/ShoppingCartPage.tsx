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
  
  // Function to fix IPFS image URLs with error handling
  const getFixedImageUrl = (url: string | undefined) => {
    if (!url) return 'https://placehold.co/300x300/1db954/FFFFFF?text=No+Image';
    
    try {
      if (url.includes('/Screenshot')) {
        return url.split('/Screenshot')[0];
      }
      
      // Fix IPFS URLs
      if (url.includes('/ipfs/')) {
        const cid = url.match(/\/ipfs\/([^/]+)/)?.[1] || '';
        return `https://ipfs.io/ipfs/${cid}`;
      }
      
      return url;
    } catch {
      return 'https://placehold.co/300x300/1db954/FFFFFF?text=Error';
    }
  };
  
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
        <div className="text-center p-8 bg-background-elevated rounded-lg border border-background-highlight">
          <h2 className="text-xl font-bold mb-2">Your Cart is Empty</h2>
          <button
            onClick={handleContinueShopping}
            className="mt-4 px-4 py-2 bg-primary text-white rounded flex items-center justify-center mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Browse Marketplace
          </button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-background-highlight">
          <h2 className="text-xl font-semibold">Items in Cart ({items.length})</h2>
          <button
            onClick={clearCart}
            className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Clear Cart
          </button>
        </div>
        
        {items.map((item) => (
          <div 
            key={item.track.id} 
            className="bg-gradient-to-r from-background-elevated to-background rounded-xl p-4 border border-background-highlight transition-all hover:shadow-md group relative overflow-hidden"
          >
            {/* Subtle animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex items-center relative z-10">
              <div className="relative rounded-lg overflow-hidden mr-5 flex-shrink-0">
                <img
                  src={getFixedImageUrl(item.track.image_uri || item.track.albumCover)}
                  alt={item.track.name || item.track.title}
                  className="w-20 h-20 object-cover transition-transform group-hover:scale-110 duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/300x300/1db954/FFFFFF?text=Error';
                  }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{item.track.name || item.track.title}</h3>
                <p className="text-sm text-gray-400">{item.track.artist}</p>
                <div className="flex items-center mt-2">
                  <span className="mr-3 text-xs bg-primary/20 text-primary rounded-full px-3 py-1 font-medium">
                    {item.track.nftPrice}
                  </span>
                  <span className="text-xs text-text-secondary bg-gray-800/50 rounded-full px-3 py-1">
                    {item.track.licenseType}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mr-6">
                <button
                  onClick={() => handleQuantityChange(item.track.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-background-highlight hover:bg-primary/20 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.track.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-background-highlight hover:bg-primary/20 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <button
                onClick={() => handleRemoveItem(item.track.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-background-highlight"
                aria-label="Remove item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
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
      <div className="bg-gradient-to-b from-background-elevated to-background rounded-xl p-6 border border-background-highlight shadow-lg">
        <h3 className="font-bold text-xl mb-6 pb-2 border-b border-background-highlight">Order Summary</h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Subtotal</span>
            <span className="font-medium">{subtotal.toFixed(4)} ETH</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Service Fee (2.5%)</span>
            <span className="font-medium">{fees.toFixed(4)} ETH</span>
          </div>
          <div className="border-t border-background-highlight my-4"></div>
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total</span>
            <div className="flex items-center text-primary">
              <svg className="w-5 h-5 mr-1" viewBox="0 0 33 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.3576 0.666687L16.0095 1.85009V36.1896L16.3576 36.5371L32.2976 27.115L16.3576 0.666687Z" fill="#1db954"/>
                <path d="M16.3578 0.666687L0.417816 27.115L16.3578 36.5372V19.8699V0.666687Z" fill="#1db954"/>
                <path d="M16.3575 39.5552L16.1613 39.7944V52.0268L16.3575 52.6L32.3066 30.1378L16.3575 39.5552Z" fill="#1db954"/>
                <path d="M16.3578 52.5998V39.5551L0.417816 30.1377L16.3578 52.5998Z" fill="#1db954"/>
                <path d="M16.3575 36.537L32.2973 27.1151L16.3575 19.8699V36.537Z" fill="#1db954"/>
                <path d="M0.417816 27.1151L16.3576 36.537V19.8699L0.417816 27.1151Z" fill="#1db954"/>
              </svg>
              {total.toFixed(4)} ETH
            </div>
          </div>
        </div>
        
        {checkoutStep === 'cart' && (
          <button
            onClick={handleCheckout}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg transition-all hover:shadow-lg hover:scale-[1.02] transform flex items-center justify-center font-medium"
            disabled={items.length === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Proceed to Checkout
          </button>
        )}
        
        {checkoutStep === 'confirmation' && (
          <button
            onClick={handleConfirmPurchase}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg transition-all hover:shadow-lg hover:scale-[1.02] transform flex items-center justify-center font-medium"
            disabled={isLoading || isPurchasing || isConfirming}
          >
            {isLoading || isPurchasing || isConfirming ? (
              <>
                <div className="animate-spin w-5 h-5 border-t-2 border-r-2 border-white rounded-full mr-2"></div>
                Processing Transaction...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Confirm Purchase
              </>
            )}
          </button>
        )}
        
        {/* Show a security badge */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-xs text-gray-400 space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure Blockchain Transaction</span>
          </div>
        </div>
      </div>
    );
  };
  
  const renderConfirmationStep = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Confirm Your Purchase</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-b from-background-elevated to-background rounded-xl p-6 border border-background-highlight shadow-lg">
            <h3 className="font-semibold text-xl mb-4 pb-2 border-b border-background-highlight flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              Payment Method
            </h3>
            
            <div className="space-y-3">
              <div 
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedPaymentMethod === 'ethereum' 
                    ? 'border-primary bg-primary/10 shadow-md' 
                    : 'border-background-highlight'
                }`}
                onClick={() => setSelectedPaymentMethod('ethereum')}
              >
                <div className="w-10 h-10 mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32" fill="none">
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
                  <div className="font-medium text-lg">Ethereum</div>
                  <div className="text-sm text-gray-400">Pay with ETH from your connected wallet</div>
                </div>
                <div className="w-6 h-6 rounded-full border border-primary flex items-center justify-center">
                  {selectedPaymentMethod === 'ethereum' && (
                    <div className="w-4 h-4 bg-primary rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-xl">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm">
                    Your wallet will be prompted to confirm this transaction. Gas fees may apply depending on network conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            {renderCheckoutSummary()}
            
            <div className="mt-6 bg-yellow-900/20 border border-yellow-500/30 text-yellow-200 p-4 rounded-xl">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-medium mb-2">Important Information</h4>
                  <p className="text-sm">
                    By confirming this purchase, you are agreeing to the license terms for each music NFT.
                    Once purchased, these digital assets will be transferred to your wallet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-xl mt-6">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>{error}</div>
            </div>
          </div>
        )}
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setCheckoutStep('cart')}
            className="px-6 py-3 bg-transparent border border-background-highlight text-white hover:bg-background-highlight rounded-lg transition-all hover:shadow-md"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Cart
          </button>
          
          <button
            onClick={handleConfirmPurchase}
            className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg transition-all hover:shadow-lg hover:scale-[1.02] transform flex items-center justify-center font-medium"
            disabled={isLoading || isPurchasing || isConfirming}
          >
            {isLoading || isPurchasing || isConfirming ? (
              <>
                <div className="animate-spin w-5 h-5 border-t-2 border-r-2 border-white rounded-full mr-2"></div>
                Processing Transaction...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Confirm Purchase
              </>
            )}
          </button>
        </div>
      </div>
    );
  };
  
  const renderSuccessStep = () => {
    return (
      <div className="text-center py-16 bg-gradient-to-b from-background-elevated to-background rounded-xl border border-background-highlight shadow-xl max-w-2xl mx-auto">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-primary flex items-center justify-center mx-auto mb-8 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold mb-4 text-white">Purchase Successful!</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Your music NFTs have been successfully added to your collection. You can now enjoy them or continue exploring more unique tracks.
        </p>
        
        {transactionHash && (
          <div className="mb-8 mx-auto max-w-md bg-background/50 rounded-lg p-4 border border-background-highlight">
            <p className="text-sm text-gray-400 mb-2">Transaction Hash:</p>
            <a 
              href={`https://etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark transition-colors font-mono text-xs break-all inline-block"
            >
              {transactionHash}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5z" />
              </svg>
            </a>
          </div>
        )}
        
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigation', { detail: 'library' }))}
            className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg transition-all hover:shadow-lg hover:scale-105 transform font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            View My Collection
          </button>
          
          <button
            onClick={handleContinueShopping}
            className="px-8 py-3 bg-transparent border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-all hover:shadow-md font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto mb-20">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        {checkoutStep === 'cart' && 'Your Shopping Cart'}
        {checkoutStep === 'confirmation' && 'Checkout'}
        {checkoutStep === 'success' && 'Order Complete'}
      </h1>
      
      {error && checkoutStep === 'cart' && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>{error}</div>
          </div>
        </div>
      )}
      
      {checkoutStep === 'cart' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
