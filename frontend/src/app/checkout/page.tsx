'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCart } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function CheckoutPage() {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [placing, setPlacing] = useState(false);
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { cartItems } = useAppSelector(state => state.cart);
  const { userInfo } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [userInfo, cartItems, router]);

  const total = cartItems.reduce((acc, item) => acc + item.quantity * Number(item.price), 0);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      const orderData = {
        orderItems: cartItems,
        shippingAddress: `${address}, ${city}, ${country}`,
        totalAmount: total
      };
      
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders`, orderData, config);
      
      if (data.success) {
        toast.success('Order placed successfully!');
        dispatch(clearCart());
        router.push('/profile');
      }
    } catch (error: any) {
      toast.error('Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="flex-1 px-md lg:px-xl py-section bg-canvas flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-heading-xl mb-xl text-center">Checkout</h1>
        
        <form onSubmit={placeOrder} className="flex flex-col space-y-md">
          <h2 className="text-heading-md border-b border-hairline-soft pb-sm mb-sm">Shipping Address</h2>
          
          <div className="flex flex-col">
            <label className="text-caption-md mb-xs">Street Address</label>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="border border-hairline p-sm text-body-md focus:outline-none focus:border-ink"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-caption-md mb-xs">City</label>
            <input 
              type="text" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="border border-hairline p-sm text-body-md focus:outline-none focus:border-ink"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-caption-md mb-xs">Country</label>
            <input 
              type="text" 
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="border border-hairline p-sm text-body-md focus:outline-none focus:border-ink"
            />
          </div>

          <h2 className="text-heading-md border-b border-hairline-soft pb-sm mt-xl mb-sm">Order Summary</h2>
          <div className="flex justify-between font-bold text-body-strong bg-soft-cloud p-md">
            <span>Total to Pay:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button 
            type="submit" 
            disabled={placing}
            className="w-full bg-ink text-canvas py-sm text-button-md rounded-full mt-xl hover:bg-charcoal transition-colors disabled:opacity-50"
          >
            {placing ? 'Placing Order...' : 'Confirm Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
