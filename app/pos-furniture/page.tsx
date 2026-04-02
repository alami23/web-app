'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Image from 'next/image'
import { Search, Plus, Minus, Trash2, Printer, ShoppingCart, Armchair, LayoutGrid, List } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

const furnitureProducts = [
  { id: 1, name: 'Royal King Size Bed', category: 'Bed', price: 45000, stock: 5, image: 'https://picsum.photos/seed/bed1/400/400' },
  { id: 2, name: 'Modern Velvet Sofa', category: 'Sofa', price: 32000, stock: 8, image: 'https://picsum.photos/seed/sofa1/400/400' },
  { id: 3, name: 'Classic Dining Table', category: 'Dining', price: 28000, stock: 4, image: 'https://picsum.photos/seed/dining1/400/400' },
  { id: 4, name: 'Ergonomic Office Chair', category: 'Chair', price: 12000, stock: 15, image: 'https://picsum.photos/seed/chair1/400/400' },
  { id: 5, name: 'Wooden Wardrobe', category: 'Wardrobe', price: 38000, stock: 3, image: 'https://picsum.photos/seed/wardrobe1/400/400' },
  { id: 6, name: 'Dressing Table', category: 'Dressing', price: 15000, stock: 6, image: 'https://picsum.photos/seed/dressing1/400/400' },
  { id: 7, name: 'TV Trolley', category: 'TV Unit', price: 8500, stock: 10, image: 'https://picsum.photos/seed/tv1/400/400' },
  { id: 8, name: 'Bookshelf', category: 'Shelf', price: 11000, stock: 7, image: 'https://picsum.photos/seed/shelf1/400/400' },
]

const categories = ['All', 'Bed', 'Sofa', 'Dining', 'Chair', 'Wardrobe', 'Office']

export default function POSFurniture() {
  const [cart, setCart] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const deliveryCharge = cart.length > 0 ? 500 : 0
  const total = subtotal + deliveryCharge

  const filteredProducts = furnitureProducts.filter(p => 
    (activeCategory === 'All' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
        {/* Left: Product Selection */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search furniture..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white border border-slate-200 rounded-xl p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn("p-1.5 rounded-lg transition-colors", viewMode === 'grid' ? "bg-slate-100 text-amber-600" : "text-slate-400")}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn("p-1.5 rounded-lg transition-colors", viewMode === 'list' ? "bg-slate-100 text-amber-600" : "text-slate-400")}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  activeCategory === cat 
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" 
                    : "bg-white text-slate-600 border border-slate-200 hover:border-amber-500"
                )}
              >
                {cat}
              </button>
            ))}
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
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                          {product.category}
                        </span>
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
        <div className="w-full lg:w-[400px] bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
          <div className="p-6 bg-slate-900 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart size={20} /> Order Summary
              </h2>
              <button 
                onClick={() => setCart([])}
                className="text-slate-400 hover:text-white text-sm font-semibold"
              >
                Reset
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl border border-white/10">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                  <Plus size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="Select Customer..." 
                  className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-400 w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Armchair size={48} strokeWidth={1} />
                  <p>No furniture selected</p>
                </div>
              ) : (
                cart.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-4"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill
                        className="object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-slate-500">৳{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-slate-500"><Minus size={14} /></button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm text-slate-500"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span>৳{deliveryCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-4 px-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Printer size={18} /> A4 Print
              </button>
              <button className="py-4 px-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
