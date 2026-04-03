'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Image from 'next/image'
import { Search, Plus, Minus, Trash2, Printer, ShoppingCart, Armchair, LayoutGrid, List, Check, UserPlus, Bed, Coffee, Briefcase, Tv, Layers, Sparkles, Archive, Home } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import AddCustomerModal from '@/components/AddCustomerModal'

interface FurnitureProduct {
  id: number
  name: string
  category: string
  subCategory: string
  price: number
  stock: number
  image: string
  description?: string
  sku?: string
}

const initialFurnitureProducts: FurnitureProduct[] = [
  { id: 1, name: 'Royal King Size Bed', category: 'Bed', subCategory: 'King', price: 45000, stock: 5, image: 'https://picsum.photos/seed/bed1/400/400' },
  { id: 2, name: 'Modern Velvet Sofa', category: 'Sofa', subCategory: '3-Seater', price: 32000, stock: 8, image: 'https://picsum.photos/seed/sofa1/400/400' },
  { id: 3, name: 'Classic Dining Table', category: 'Dining', subCategory: '6-Seater', price: 28000, stock: 4, image: 'https://picsum.photos/seed/dining1/400/400' },
  { id: 4, name: 'Ergonomic Office Chair', category: 'Chair', subCategory: 'Office', price: 12000, stock: 15, image: 'https://picsum.photos/seed/chair1/400/400' },
  { id: 5, name: 'Wooden Wardrobe', category: 'Wardrobe', subCategory: '4-Door', price: 38000, stock: 3, image: 'https://picsum.photos/seed/wardrobe1/400/400' },
  { id: 6, name: 'Dressing Table', category: 'Dressing', subCategory: 'Modern', price: 15000, stock: 6, image: 'https://picsum.photos/seed/dressing1/400/400' },
  { id: 7, name: 'TV Trolley', category: 'TV Unit', subCategory: 'Floor Stand', price: 8500, stock: 10, image: 'https://picsum.photos/seed/tv1/400/400' },
  { id: 8, name: 'Bookshelf', category: 'Shelf', subCategory: 'Floor', price: 11000, stock: 7, image: 'https://picsum.photos/seed/shelf1/400/400' },
]

const categories = ['All', 'Bed', 'Sofa', 'Dining', 'Chair', 'Wardrobe', 'Office', 'Dressing', 'TV Unit', 'Shelf']
const categoryIcons: Record<string, any> = {
  'All': Home,
  'Bed': Bed,
  'Sofa': Armchair,
  'Dining': Coffee,
  'Chair': Armchair,
  'Wardrobe': Archive,
  'Office': Briefcase,
  'Dressing': Sparkles,
  'TV Unit': Tv,
  'Shelf': Layers
}
const subCategoriesMap: Record<string, string[]> = {
  'All': [],
  'Bed': ['Single', 'Double', 'King', 'Queen'],
  'Sofa': ['1-Seater', '2-Seater', '3-Seater', 'Corner'],
  'Dining': ['4-Seater', '6-Seater', '8-Seater'],
  'Chair': ['Office', 'Dining', 'Lounge'],
  'Wardrobe': ['2-Door', '3-Door', '4-Door'],
  'Office': ['Desk', 'File Cabinet'],
  'Dressing': ['Modern', 'Classic'],
  'TV Unit': ['Wall Mount', 'Floor Stand'],
  'Shelf': ['Wall', 'Floor']
}

export default function POSFurniture() {
  const [products, setProducts] = useState<FurnitureProduct[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('furniture_inventory');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse furniture inventory', e);
        }
      }
    }
    return initialFurnitureProducts;
  });

  useEffect(() => {
    localStorage.setItem('furniture_inventory', JSON.stringify(products));
  }, [products]);

  const [cart, setCart] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeSubCategory, setActiveSubCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState('Walk-in Customer')
  const [isAddingCustomer, setIsAddingCustomer] = useState(false)

  useEffect(() => {
    const loadCustomers = () => {
      const saved = localStorage.getItem('customers_list')
      if (saved) {
        setCustomers(JSON.parse(saved))
      }
    }
    loadCustomers()
    window.addEventListener('storage', loadCustomers)
    return () => window.removeEventListener('storage', loadCustomers)
  }, [])

  const handleAddCustomer = (customer: any) => {
    const updated = [...customers, customer]
    setCustomers(updated)
    localStorage.setItem('customers_list', JSON.stringify(updated))
    setSelectedCustomer(customer.name)
  }

  const addToCart = (product: FurnitureProduct) => {
    const existing = cart.find(item => item.id === product.id)
    const currentQty = existing ? existing.quantity : 0
    
    if (currentQty >= product.stock) {
      alert(`Only ${product.stock} units available in stock.`)
      return
    }

    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id: number, delta: number) => {
    const product = products.find(p => p.id === id)
    if (!product) return

    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta
        if (newQty > product.stock) {
          alert(`Only ${product.stock} units available in stock.`)
          return item
        }
        return { ...item, quantity: Math.max(1, newQty) }
      }
      return item
    }))
  }

  const handleCheckout = () => {
    if (cart.length === 0) return

    // Update stock in products
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id)
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity }
      }
      return product
    })

    setProducts(updatedProducts)
    setCart([])
    setIsCheckoutSuccess(true)
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const deliveryCharge = cart.length > 0 ? 500 : 0
  const total = subtotal + deliveryCharge

  const filteredProducts = products.filter(p => 
    (activeCategory === 'All' || p.category === activeCategory) &&
    (activeSubCategory === 'All' || p.subCategory === activeSubCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
        {/* Left: Product Selection */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="space-y-4 sticky top-0 z-20 bg-slate-50/95 backdrop-blur-md py-4 -mt-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search premium furniture..." 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all shadow-sm hover:border-slate-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 self-stretch">
                <div className="flex bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded-xl transition-all", 
                      viewMode === 'grid' ? "bg-amber-600 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 rounded-xl transition-all", 
                      viewMode === 'list' ? "bg-amber-600 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
                {categories.map(cat => {
                  const Icon = categoryIcons[cat] || Home
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat)
                        setActiveSubCategory('All')
                      }}
                      className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all border",
                        activeCategory === cat 
                          ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 scale-105" 
                          : "bg-white text-slate-600 border-slate-200 hover:border-amber-500 hover:text-amber-600"
                      )}
                    >
                      <Icon size={18} className={cn(activeCategory === cat ? "text-amber-400" : "text-slate-400")} />
                      {cat}
                    </button>
                  )
                })}
              </div>

              <AnimatePresence mode="wait">
                {activeCategory !== 'All' && subCategoriesMap[activeCategory] && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1"
                  >
                    <button
                      onClick={() => setActiveSubCategory('All')}
                      className={cn(
                        "px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                        activeSubCategory === 'All'
                          ? "bg-amber-100 text-amber-700 border-amber-200 shadow-sm"
                          : "bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200"
                      )}
                    >
                      All {activeCategory}
                    </button>
                    {subCategoriesMap[activeCategory].map(sub => (
                      <button
                        key={sub}
                        onClick={() => setActiveSubCategory(sub)}
                        className={cn(
                          "px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                          activeSubCategory === sub
                            ? "bg-amber-600 text-white border-amber-600 shadow-md"
                            : "bg-white text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-600"
                        )}
                      >
                        {sub}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <motion.div
                    layout
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group overflow-hidden"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-wider shadow-sm">
                          {product.category}
                        </span>
                        {product.subCategory && (
                          <span className="bg-amber-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                            {product.subCategory}
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                          Add to Cart
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-800 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-bold text-slate-900">৳{product.price.toLocaleString()}</span>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded",
                          product.stock > 5 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        )}>
                          {product.stock} IN STOCK
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-4 hover:border-amber-500 cursor-pointer transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image 
                        src={product.image} 
                        alt={product.name}
                        fill
                        className="object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{product.name}</h4>
                      <p className="text-xs text-slate-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">৳{product.price.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">{product.stock} available</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart/Checkout */}
        <div className="w-full lg:w-[420px] bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
          <div className="p-8 bg-slate-900 text-white space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <div className="bg-amber-500 p-2 rounded-xl">
                    <ShoppingCart size={24} className="text-slate-900" />
                  </div>
                  Cart
                </h2>
                <button 
                  onClick={() => {
                    setCart([])
                    setSelectedCustomer('Walk-in Customer')
                  }}
                  className="text-slate-400 hover:text-white text-sm font-semibold transition-colors"
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Customer Details</label>
                <div className="flex items-center gap-2">
                  <select 
                    className="flex-1 p-3 bg-white/5 border border-white/10 rounded-2xl text-sm outline-none focus:border-amber-500 transition-all text-white appearance-none cursor-pointer hover:bg-white/10"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                  >
                    <option value="Walk-in Customer" className="text-slate-900">Walk-in Customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.name} className="text-slate-900">{c.name} ({c.phone})</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setIsAddingCustomer(true)}
                    className="p-3 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-2xl transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                    title="Add New Customer"
                  >
                    <UserPlus size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4 py-12">
                  <div className="bg-slate-50 p-8 rounded-full">
                    <Armchair size={64} strokeWidth={1} className="text-slate-200" />
                  </div>
                  <p className="font-medium">Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill
                        className="object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">{item.name}</h4>
                      <p className="text-xs font-semibold text-amber-600">৳{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-white rounded-lg shadow-sm text-slate-600 transition-all active:scale-90"><Minus size={12} /></button>
                      <span className="text-sm font-bold w-8 text-center text-slate-800">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:bg-white rounded-lg shadow-sm text-slate-600 transition-all active:scale-90"><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-slate-500 text-sm font-medium">
                <span>Subtotal</span>
                <span className="text-slate-900 font-bold">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-sm font-medium">
                <span>Delivery Charge</span>
                <span className="text-slate-900 font-bold">৳{deliveryCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Amount</span>
                <span className="text-3xl font-black text-slate-900">৳{total.toLocaleString()}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="py-4 px-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
                <Printer size={20} /> Print
              </button>
              <button 
                onClick={handleCheckout}
                className="py-4 px-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/30 active:scale-95 flex items-center justify-center gap-2"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isCheckoutSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutSuccess(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Successful!</h2>
              <p className="text-slate-500 mb-8">The furniture stock has been updated and the invoice is ready.</p>
              <button 
                onClick={() => setIsCheckoutSuccess(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Add Customer Modal */}
      <AddCustomerModal 
        isOpen={isAddingCustomer}
        onClose={() => setIsAddingCustomer(false)}
        onAdd={handleAddCustomer}
      />
    </DashboardLayout>
  )
}
