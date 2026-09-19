'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { userInfo } = useAppSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!userInfo) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/myorders`, config);
        setOrders(data.data);
      } catch (error) {
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, router]);

  if (!mounted || !userInfo) return null;

  return (
    <div className="flex-1 px-md lg:px-xl py-section bg-canvas flex flex-col md:flex-row gap-xl">
      <div className="flex-1">
        <h1 className="text-heading-xl mb-xl">Profile</h1>
        <div className="bg-soft-cloud p-xl flex flex-col space-y-md">
          <div className="text-body-strong">Name: <span className="font-normal text-mute">{userInfo.name}</span></div>
          <div className="text-body-strong">Email: <span className="font-normal text-mute">{userInfo.email}</span></div>
        </div>
      </div>
      
      <div className="flex-[2]">
        <h2 className="text-heading-lg mb-lg">Order History</h2>
        {loading ? (
          <div className="text-body-md text-mute">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-body-md text-mute border border-hairline p-xl text-center">No orders yet.</div>
        ) : (
          <div className="flex flex-col space-y-md">
            {orders.map((order: any) => (
              <div key={order.id} className="border border-hairline p-md flex flex-col space-y-sm">
                <div className="flex justify-between border-b border-hairline-soft pb-sm text-caption-md">
                  <span className="text-mute">Order ID: {order.id}</span>
                  <span className={`font-bold ${order.status === 'PENDING' ? 'text-accent-teal' : 'text-success'}`}>{order.status}</span>
                </div>
                <div className="flex flex-col space-y-xs pt-xs">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-body-md">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold pt-sm border-t border-hairline-soft text-body-strong">
                  <span>Total</span>
                  <span>${Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
