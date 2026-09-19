'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { userInfo } = useAppSelector((state) => state.auth);
  
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setMounted(true);
    if (!userInfo || !userInfo.isAdmin) {
      router.push('/');
      return;
    }
    fetchProducts();
    fetchOrders();
  }, [userInfo, router]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`);
      setProducts(data.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders`, config);
      setOrders(data.data);
    } catch (error) {
      toast.error('Failed to load orders');
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/${id}`, config);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      
      let finalImageUrl = imageUrl;

      // If there's a new file selected, upload it first
      if (imageFile) {
        if (imageFile.size > 5000000) {
          toast.error('Image exceeds 5MB limit');
          return;
        }
        const formData = new FormData();
        formData.append('image', imageFile);
        
        try {
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          finalImageUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${data}`;
        } catch (uploadError) {
          toast.error('Image upload failed');
          return;
        }
      }

      const productData = { 
        name, slug, description, category, imageUrl: finalImageUrl, 
        price: Number(price), stock: Number(stock) 
      };

      if (editingId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/${editingId}`, productData, config);
        toast.success('Product updated successfully!');
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`, productData, config);
        toast.success('Product created successfully!');
      }
      
      setFormOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const editHandler = (product: any) => {
    setEditingId(product.id);
    setName(product.name);
    setSlug(product.slug);
    setPrice(product.price);
    setCategory(product.category);
    setImageUrl(product.imageUrl);
    setStock(product.stock);
    setDescription(product.description);
    setFormOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setName(''); setSlug(''); setPrice('');
    setCategory(''); setImageUrl(''); setImageFile(null); setStock(''); setDescription('');
  };

  if (!mounted || !userInfo || !userInfo.isAdmin) return null;

  return (
    <div className="flex-1 px-md lg:px-xl py-section bg-canvas flex flex-col">
      <div className="flex justify-between items-center mb-xl">
        <div className="flex items-center space-x-lg">
          <h1 className="text-heading-xl">Admin Dashboard</h1>
          <div className="flex bg-soft-cloud rounded-full p-1 border border-hairline-soft">
            <button onClick={() => setActiveTab('products')} className={`px-md py-sm rounded-full text-button-md transition-colors ${activeTab === 'products' ? 'bg-ink text-canvas' : 'text-mute hover:text-ink'}`}>Products</button>
            <button onClick={() => setActiveTab('orders')} className={`px-md py-sm rounded-full text-button-md transition-colors ${activeTab === 'orders' ? 'bg-ink text-canvas' : 'text-mute hover:text-ink'}`}>Orders</button>
          </div>
        </div>
        {activeTab === 'products' && (
          <button 
            onClick={() => { resetForm(); setFormOpen(!formOpen); }}
            className="bg-ink text-canvas px-xl py-sm rounded-full text-button-md hover:bg-charcoal transition-colors"
          >
            {formOpen ? 'Cancel' : 'Create Product'}
          </button>
        )}
      </div>

      {activeTab === 'products' && formOpen && (
        <div className="bg-soft-cloud p-xl mb-xl border border-hairline-soft">
          <h2 className="text-heading-md mb-md">{editingId ? 'Edit Product' : 'New Product'}</h2>
          <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="flex flex-col"><label className="text-caption-md mb-xs">Name</label><input type="text" value={name} onChange={(e)=>setName(e.target.value)} required className="border p-sm" /></div>
            <div className="flex flex-col"><label className="text-caption-md mb-xs">Slug</label><input type="text" value={slug} onChange={(e)=>setSlug(e.target.value)} required className="border p-sm" /></div>
            <div className="flex flex-col"><label className="text-caption-md mb-xs">Price</label><input type="number" step="0.01" value={price} onChange={(e)=>setPrice(e.target.value)} required className="border p-sm" /></div>
            <div className="flex flex-col"><label className="text-caption-md mb-xs">Stock</label><input type="number" value={stock} onChange={(e)=>setStock(e.target.value)} required className="border p-sm" /></div>
            <div className="flex flex-col"><label className="text-caption-md mb-xs">Category</label><input type="text" value={category} onChange={(e)=>setCategory(e.target.value)} required className="border p-sm" /></div>
            <div className="flex flex-col">
              <label className="text-caption-md mb-xs">Product Image (Max 5MB)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    if (file.size > 5000000) {
                      toast.error('Image exceeds 5MB limit');
                      e.target.value = ''; // reset input
                    } else {
                      setImageFile(file);
                    }
                  }
                }}
                className="border p-sm" 
              />
              {imageUrl && !imageFile && <span className="text-utility-xs text-mute mt-1">Current: {imageUrl.substring(0,30)}...</span>}
            </div>
            <div className="flex flex-col md:col-span-2"><label className="text-caption-md mb-xs">Description</label><textarea value={description} onChange={(e)=>setDescription(e.target.value)} required className="border p-sm h-24" /></div>
            
            <button type="submit" className="md:col-span-2 bg-ink text-canvas py-sm text-button-md hover:bg-charcoal transition-colors">Save Product</button>
          </form>
        </div>
      )}

      {loading ? <div className="text-body-md text-mute">Loading...</div> : (
        activeTab === 'products' ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-hairline text-caption-md text-mute uppercase tracking-widest">
                  <th className="py-md px-sm">ID</th>
                  <th className="py-md px-sm">Name</th>
                  <th className="py-md px-sm">Price</th>
                  <th className="py-md px-sm">Category</th>
                  <th className="py-md px-sm">Stock</th>
                  <th className="py-md px-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-hairline-soft text-body-md hover:bg-soft-cloud transition-colors">
                    <td className="py-md px-sm text-utility-xs text-mute">{product.id.slice(0, 8)}...</td>
                    <td className="py-md px-sm text-body-strong">{product.name}</td>
                    <td className="py-md px-sm">${Number(product.price).toFixed(2)}</td>
                    <td className="py-md px-sm">{product.category}</td>
                    <td className="py-md px-sm">{product.stock}</td>
                    <td className="py-md px-sm text-right space-x-md">
                      <button onClick={() => editHandler(product)} className="text-utility-xs uppercase tracking-wider text-mute hover:text-ink underline">Edit</button>
                      <button onClick={() => deleteHandler(product.id)} className="text-utility-xs uppercase tracking-wider text-sale hover:text-sale-deep underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-hairline text-caption-md text-mute uppercase tracking-widest">
                  <th className="py-md px-sm">Order ID</th>
                  <th className="py-md px-sm">User / Email</th>
                  <th className="py-md px-sm">Total</th>
                  <th className="py-md px-sm">Status</th>
                  <th className="py-md px-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-hairline-soft text-body-md hover:bg-soft-cloud transition-colors">
                    <td className="py-md px-sm text-utility-xs text-mute">{order.id}</td>
                    <td className="py-md px-sm text-body-strong">{order.user?.name} <span className="text-mute font-normal text-utility-xs block">{order.user?.email}</span></td>
                    <td className="py-md px-sm font-bold">${Number(order.totalAmount).toFixed(2)}</td>
                    <td className="py-md px-sm font-bold text-accent-teal">{order.status}</td>
                    <td className="py-md px-sm text-utility-xs text-mute">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
