'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { addToCartLocal } from '@/store/slices/cartSlice';
import ProductCard from '@/components/ProductCard';
import toast from 'react-hot-toast';
import axios from 'axios';

// Mock data for colors since DB doesn't have it
const COLORS = [
  { name: 'Red', hex: '#E74C3C' },
  { name: 'Black', hex: '#2C3E50' },
  { name: 'Green', hex: '#82E0AA' },
  { name: 'White', hex: '#FDFEFE' },
  { name: 'Blue', hex: '#85C1E9' },
];

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<any>(null);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Local interaction state
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchProductAndRecommendations = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/slug/${resolvedParams.slug}`);
        setProduct(data.data);
        
        // Reset state on new product load
        setQuantity(1);
        setActiveImageIndex(0);

        const allRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`);
        if (allRes.data && allRes.data.data) {
          const others = allRes.data.data.filter((p: any) => p.slug !== resolvedParams.slug);
          setRecommended(others.slice(0, 4));
        }
      } catch (error) {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRecommendations();
  }, [resolvedParams.slug]);

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCartLocal({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      quantity: quantity
    }));
    toast.success('Added to Cart');
  };

  const orderNowHandler = () => {
    addToCartHandler();
    router.push('/checkout');
  };

  if (loading) {
    return <div className="flex-1 flex justify-center items-center min-h-screen bg-canvas text-body-md">Loading...</div>;
  }

  if (!product) {
    return <div className="flex-1 flex justify-center items-center min-h-screen bg-canvas text-body-md">Product not found.</div>;
  }

  // Generate mock thumbnails (real image + 4 duplicates/placeholders)
  const thumbnails = [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
    product.imageUrl
  ];

  return (
    <div className="bg-canvas min-h-screen text-ink font-sans pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-mute mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <span className="hover:text-ink cursor-pointer" onClick={() => router.push('/')}>Home</span>
          <span>/</span>
          <span className="hover:text-ink cursor-pointer" onClick={() => router.push('/shop')}>Shop</span>
          <span>/</span>
          <span className="hover:text-ink cursor-pointer">{product.category}</span>
          <span>/</span>
          <span className="font-bold text-ink">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          
          {/* LEFT: Image Gallery */}
          <div className="flex flex-col mb-10 lg:mb-0">
            {/* Main Image */}
            <div className="w-full bg-[#f6f6f6] relative aspect-square rounded-2xl overflow-hidden flex items-center justify-center p-8 border border-transparent">
              <Image 
                src={thumbnails[activeImageIndex]} 
                alt={product.name} 
                fill 
                unoptimized 
                className="object-contain object-center scale-90 mix-blend-multiply transition-opacity duration-300" 
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex space-x-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
              {thumbnails.map((thumb, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-24 h-24 flex-shrink-0 bg-[#f6f6f6] rounded-xl overflow-hidden p-2 transition-all ${activeImageIndex === index ? 'ring-2 ring-brand-green ring-offset-2' : 'border border-hairline hover:border-mute'}`}
                >
                  <Image 
                    src={thumb} 
                    alt={`Thumbnail ${index + 1}`} 
                    fill 
                    unoptimized 
                    className="object-contain object-center scale-75 mix-blend-multiply" 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Information */}
          <div className="flex flex-col px-2 sm:px-0 text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-ink tracking-tight mb-2">{product.name}</h1>
            
            <p className="text-sm text-stone leading-relaxed w-full mb-4 line-clamp-3">
              {product.description || 'A perfect balance of exhilarating high-fidelity audio and the effortless magic of premium engineering.'}
            </p>

            {/* Ratings */}
            <div className="flex items-center mb-6 cursor-pointer hover:opacity-80">
              <div className="flex text-[#14b8a6] text-sm">
                ★★★★★
              </div>
              <span className="ml-2 text-xs text-mute">(121)</span>
            </div>

            <div className="border-t border-hairline-soft w-full my-6"></div>

            {/* Price Section */}
            <div className="flex flex-col mb-6">
              <div className="text-2xl font-bold text-ink">
                ${Number(product.price).toFixed(2)} <span className="font-normal text-xl text-stone">or 99.99/month</span>
              </div>
              <p className="text-xs text-mute mt-1">Suggested payments with 6 months special financing</p>
            </div>

            <div className="border-t border-hairline-soft w-full my-6"></div>

            {/* Color Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-ink mb-4">Choose a Color</h3>
              <div className="flex space-x-3">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedColor.name === color.name ? 'ring-2 ring-brand-green ring-offset-2' : 'border border-hairline'}`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Select ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity & Stock */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <div className="flex items-center bg-[#f6f6f6] rounded-full px-2 py-1 border border-hairline w-32 justify-between">
                <button 
                  onClick={decreaseQuantity} 
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center text-ink text-lg font-medium hover:bg-hairline rounded-full disabled:opacity-30"
                >−</button>
                <span className="font-bold text-ink text-sm w-4 text-center">{quantity}</span>
                <button 
                  onClick={increaseQuantity} 
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 flex items-center justify-center text-ink text-lg font-medium hover:bg-hairline rounded-full disabled:opacity-30"
                >+</button>
              </div>
              
              <div className="flex flex-col text-sm">
                <span className="text-ink">
                  Only <span className="text-orange-500 font-bold">{product.stock} Items</span> Left!
                </span>
                <span className="text-mute text-xs">Don't miss it</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
              <button 
                onClick={orderNowHandler}
                disabled={product.stock === 0}
                className="flex-1 bg-brand-green text-white py-4 rounded-full font-bold text-sm hover:bg-[#083a2e] transition-colors disabled:opacity-50"
              >
                {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
              </button>
              <button 
                onClick={addToCartHandler}
                disabled={product.stock === 0}
                className="flex-1 bg-white border-2 border-brand-green text-brand-green py-4 rounded-full font-bold text-sm hover:bg-brand-light-green transition-colors disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>

            {/* Delivery Information Cards */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-start p-4 border border-hairline rounded-xl bg-white">
                <svg className="w-6 h-6 text-[#d97706] mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-ink mb-1">Free Delivery</span>
                  <span className="text-xs text-mute underline cursor-pointer hover:text-ink">Enter your Postal code for Delivery Availability</span>
                </div>
              </div>
              
              <div className="flex items-start p-4 border border-hairline rounded-xl bg-white">
                <svg className="w-6 h-6 text-[#d97706] mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-ink mb-1">Return Delivery</span>
                  <span className="text-xs text-mute">Free 30days Delivery Returns. <span className="underline cursor-pointer hover:text-ink">Details</span></span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        <div className="border-t border-hairline-soft w-full my-16"></div>

        {/* Detailed Info & Reviews Sections */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-ink mb-8">Product Details</h2>
          <div className="prose prose-sm sm:prose-base text-stone max-w-4xl mb-16">
            <h3>Description</h3>
            <p>{product.description || 'Elevate your listening experience with industry-leading active noise cancellation, deep bass, and crystal clear highs. These headphones are crafted with memory foam ear cushions for all-day comfort.'}</p>
            <h3>Key Features</h3>
            <ul>
              <li>Active Noise Cancellation (ANC) block out distractions</li>
              <li>Up to 20 hours of listening time</li>
              <li>Spatial audio with dynamic head tracking</li>
              <li>Seamless pairing with all your devices</li>
            </ul>
          </div>
          
          <h2 className="text-2xl font-bold text-ink mb-8">Customer Reviews</h2>
          <div className="flex flex-col md:flex-row gap-8 mb-16">
             {/* Review Summary */}
             <div className="flex flex-col min-w-[250px]">
               <div className="text-5xl font-extrabold text-ink mb-2">4.8 <span className="text-2xl text-[#14b8a6]">★★★★★</span></div>
               <p className="text-sm text-mute mb-6">121 Reviews</p>
               
               {/* Bars */}
               {[5,4,3,2,1].map(star => (
                 <div key={star} className="flex items-center text-sm text-ink mb-2">
                   <span className="w-4 mr-2">{star}★</span>
                   <div className="flex-1 h-2 bg-soft-cloud rounded-full overflow-hidden">
                     <div className="h-full bg-[#14b8a6]" style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '0%' }}></div>
                   </div>
                 </div>
               ))}
             </div>
             
             {/* Mock Review Cards */}
             <div className="flex flex-col flex-1 space-y-6">
                {[1,2].map((i) => (
                  <div key={i} className="flex flex-col pb-6 border-b border-hairline-soft">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-ink">Jane Doe</span>
                      <span className="text-xs text-mute">2 weeks ago</span>
                    </div>
                    <div className="text-[#14b8a6] text-xs mb-2">★★★★★ <span className="ml-2 text-mute text-xs bg-soft-cloud px-2 py-0.5 rounded">Verified Purchase</span></div>
                    <p className="text-sm text-stone">Absolutely love the sound quality on these! The active noise cancellation is a game changer for my commute. Highly recommended to anyone looking for premium audio.</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Recommended Products Section */}
        {recommended.length > 0 && (
          <div className="mt-8 border-t border-hairline-soft pt-16">
            <h2 className="text-2xl font-bold text-ink tracking-tight mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {recommended.map(rec => (
                <ProductCard key={rec.id} product={rec} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
