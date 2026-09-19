import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let products: any[] = [];
  try {
    const res = await fetch(`${process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`, { cache: 'no-store' });
    const data = await res.json();
    if (data.success && data.data) {
      products = data.data;
    }
  } catch (error) {
    console.error("Backend not reachable", error);
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-canvas">
      
      {/* HERO SECTION */}
      <section className="w-full px-4 sm:px-8 py-6">
        <div className="relative w-full h-[350px] md:h-[450px] bg-[#F9F3EA] rounded-3xl overflow-hidden flex flex-col md:flex-row items-center">
          {/* Text Content */}
          <div className="flex-1 z-10 px-8 md:px-16 py-8 md:py-0 flex flex-col items-start justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-green tracking-tight leading-tight mb-8 max-w-340px">
              Grab Upto 50% Off On Selected Headphone
            </h1>
            <Link href="/shop" className="bg-brand-green text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-colors">
              Buy Now
            </Link>
          </div>
          
          {/* Image */}
          <div className="flex-1 relative h-full w-full hidden md:block">
            <Image 
              src="/images/hero.png" 
              alt="Premium Headphones" 
              fill
              priority
              unoptimized
              className="object-contain object-left"
            />
          </div>
        </div>
      </section>

      {/* FILTERS TOOLBAR */}
      <section className="w-full px-4 sm:px-8 py-4">
        <div className="flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {['Headphone Type', 'Price', 'Review', 'Color', 'Material', 'Offer'].map(filter => (
            <button key={filter} className="flex items-center bg-soft-cloud text-ink px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-hairline transition-colors">
              {filter}
              <svg className="w-4 h-4 ml-2 text-mute" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
          ))}
          <button className="flex items-center bg-soft-cloud text-ink px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-hairline transition-colors">
            All Filters
            <svg className="w-4 h-4 ml-2 text-mute" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          </button>
          
          <div className="flex-1 min-w-[20px]"></div>
          
          <button className="flex items-center bg-transparent border border-hairline text-ink px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-soft-cloud transition-colors">
            Sort by
            <svg className="w-4 h-4 ml-2 text-mute" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="w-full px-4 sm:px-8 py-6 mb-12">
        <h2 className="text-2xl font-bold text-ink mb-6">Headphones For You!</h2>
        
        {products.length === 0 ? (
          <div className="text-center text-mute py-12">No products available.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      
    </div>
  );
}
