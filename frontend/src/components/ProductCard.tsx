'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch } from '@/store/hooks';
import { addToCartLocal } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  imageUrl: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  const addToCartHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCartLocal({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      quantity: 1
    }));
    toast.success('Added to Cart');
  };

  return (
    <div className="group flex flex-col bg-canvas-alt rounded-2xl p-4 transition-shadow hover:shadow-md border border-transparent hover:border-hairline-soft relative">
      {/* Wishlist Icon */}
      <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-mute hover:text-sale transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      </button>

      <Link href={`/product/${product.slug}`} className="cursor-pointer">
        <div className="bg-transparent aspect-square relative mb-4 overflow-hidden rounded-xl flex items-center justify-center p-4">
          <Image 
            src={product.imageUrl} 
            alt={product.name}
            fill
            unoptimized
            className="object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-in-out mix-blend-multiply"
          />
        </div>
      </Link>
      
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/product/${product.slug}`} className="hover:text-brand-green transition-colors">
            <h3 className="text-sm font-bold text-ink line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-sm font-bold text-ink ml-2">${Number(product.price).toFixed(2)}</p>
        </div>
        
        <p className="text-xs text-mute mb-2 line-clamp-1">{product.category}</p>
        
        {/* Mock Rating */}
        <div className="flex items-center mb-4">
          <div className="flex text-[#FFB800] text-xs">
            ★★★★★
          </div>
          <span className="text-xs text-mute ml-1">(121)</span>
        </div>

        <div className="mt-auto">
          <button 
            onClick={addToCartHandler}
            className="border border-ink text-ink rounded-full py-1.5 px-4 text-xs font-bold hover:bg-ink hover:text-white transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
