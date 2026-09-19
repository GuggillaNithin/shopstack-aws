import ProductCard from "@/components/ProductCard";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
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
    <div className="flex-1 flex flex-col w-full bg-canvas">
      <section className="w-full px-md lg:px-xl py-section">
        <div className="flex justify-between items-end mb-xl border-b border-hairline-soft pb-md">
          <h1 className="text-heading-xl tracking-tight">All Products.</h1>
        </div>
        
        {products.length === 0 ? (
          <div className="text-body-md text-mute">No products available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
