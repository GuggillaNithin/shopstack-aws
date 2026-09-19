'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerUser, clearError } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { userInfo, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [userInfo, error, router, dispatch]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      dispatch(registerUser({ name, email, password }));
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-md py-section bg-canvas">
      <div className="max-w-1000px">
        <h1 className="text-heading-xl mb-xs">Become a Member</h1>
        <p className="text-body-md text-mute mb-xl">Create your SHOPSTACK profile.</p>

        <form onSubmit={submitHandler} className="flex flex-col space-y-md">
          <div className="flex flex-col">
            <label className="text-caption-md mb-xs">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-hairline p-sm text-body-md focus:outline-none focus:border-ink transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-caption-md mb-xs">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-hairline p-sm text-body-md focus:outline-none focus:border-ink transition-colors"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-caption-md mb-xs">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-hairline p-sm text-body-md focus:outline-none focus:border-ink transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-caption-md mb-xs">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border border-hairline p-sm text-body-md focus:outline-none focus:border-ink transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-ink text-canvas py-sm text-button-md mt-sm hover:bg-charcoal transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Join Us'}
          </button>
        </form>

        <div className="mt-xl text-center text-body-md text-stone">
          Already a member? <Link href="/login" className="text-ink underline hover:text-mute transition-colors">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
