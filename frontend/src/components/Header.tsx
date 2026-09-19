'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

const Header = () => {
  const { cartItems } = useAppSelector(state => state.cart);
  const { userInfo } = useAppSelector(state => state.auth);
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="w-full flex flex-col z-50 bg-canvas border-b border-hairline">
      {/* Top Announcement Bar */}
      <div className="bg-brand-green text-canvas flex justify-between items-center px-4 sm:px-8 py-2 text-xs">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          <span>+001234567890</span>
        </div>
        <div className="hidden sm:flex text-center">
          Get 50% Off on Selected Items | <Link href="/shop" className="ml-1 underline">Shop Now</Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center cursor-pointer">Eng <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
          <span className="flex items-center cursor-pointer">Location <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-brand-green">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path></svg>
          </div>
          <span className="text-xl font-bold text-ink tracking-tight">Shopcart</span>
        </Link>

        {/* Center Nav & Search (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-1 items-center justify-between ml-10">
          <nav className="flex space-x-6 text-sm font-medium text-ink">
            <span className="flex items-center cursor-pointer hover:text-brand-green">Categories <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
            <Link href="/shop" className="hover:text-brand-green">Deals</Link>
            <Link href="/shop" className="hover:text-brand-green">What's New</Link>
            <Link href="/shop" className="hover:text-brand-green">Delivery</Link>
            {mounted && userInfo?.isAdmin && <Link href="/admin" className="text-brand-green">Admin</Link>}
          </nav>
          
          <div className="mx-8 flex-1 max-w-md">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search Product" 
                className="w-full bg-soft-cloud text-ink text-sm rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-brand-green"
              />
              <div className="absolute right-3 top-2.5 text-mute">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-6 ml-4">
          {!mounted ? (
            <div className="flex items-center text-sm font-medium opacity-0">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span className="hidden sm:inline">Account</span>
            </div>
          ) : userInfo ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="flex items-center text-sm font-medium hover:text-brand-green">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span className="hidden sm:inline">Account</span>
              </Link>
              <button onClick={() => dispatch(logout())} className="text-sm font-medium text-mute hover:text-sale">Logout</button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center text-sm font-medium hover:text-brand-green">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span className="hidden sm:inline">Account</span>
            </Link>
          )}

          <Link href="/cart" className="flex items-center text-sm font-medium hover:text-brand-green relative">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span className="hidden sm:inline">Cart</span>
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1 -right-2 sm:right-5 bg-brand-green text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* Mobile Search (Visible only on small screens) */}
      <div className="lg:hidden px-4 pb-4">
         <div className="relative">
            <input 
              type="text" 
              placeholder="Search Product" 
              className="w-full bg-soft-cloud text-ink text-sm rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-brand-green"
            />
            <div className="absolute right-3 top-2.5 text-mute">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
      </div>
    </header>
  );
};

export default Header;
