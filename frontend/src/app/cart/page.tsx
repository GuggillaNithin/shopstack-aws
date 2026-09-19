'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeFromCartLocal, addToCartLocal } from '@/store/slices/cartSlice';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { cartItems } = useAppSelector(state => state.cart);
  const { userInfo } = useAppSelector(state => state.auth);

  const checkoutHandler = () => {
    if (!userInfo) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  const total = cartItems.reduce((acc, item) => acc + item.quantity * Number(item.price), 0);

  return (
    <div className="flex-1 px-md lg:px-xl py-section bg-canvas flex flex-col md:flex-row gap-xl">
      {/* Cart Items List */}
      <div className="flex-[2]">
        <h1 className="text-heading-lg mb-xl">Your Bag</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-body-md text-mute">
            Your bag is empty. <Link href="/" className="text-ink underline hover:text-mute">Continue shopping</Link>.
          </div>
        ) : (
          <div className="flex flex-col space-y-lg">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex border-b border-hairline-soft pb-lg">
                <div className="w-24 h-24 bg-soft-cloud relative mr-lg">
                  <Image src={item.imageUrl} alt={item.name} fill unoptimized className="object-cover" />
                </div>
                <div className="flex flex-col flex-1 justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-body-strong">{item.name}</h3>
                      <p className="text-caption-md text-mute">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-body-strong">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex mt-sm">
                    <button 
                      onClick={() => dispatch(removeFromCartLocal(item.productId))}
                      className="text-utility-xs uppercase tracking-wider text-mute hover:text-ink underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex-1">
        <h1 className="text-heading-lg mb-xl">Summary</h1>
        <div className="flex flex-col space-y-md text-body-md">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Shipping & Handling</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between border-t border-hairline pt-md font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <button 
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
            className="w-full bg-ink text-canvas py-sm text-button-md rounded-full mt-xl hover:bg-charcoal transition-colors disabled:opacity-50"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
