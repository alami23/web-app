'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Image from 'next/image'
import { Search, Plus, Minus, Trash2, Printer, ShoppingCart, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

const woodProducts = [
  { id: 1, name: 'Segun Wood', category: 'Hardwood', subCategory: 'Premium', price: 1200, stock: 150, unit: 'cu ft', image: 'https://picsum.photos/seed/segun/200/200' },
  { id: 2, name: 'Mahogany Wood', category: 'Hardwood', subCategory: 'Standard', price: 950, stock: 80, unit: 'cu ft', image: 'https://picsum.photos/seed/mahogany/200/200' },
  { id: 3, name: 'Gamari Wood', category: 'Softwood', subCategory: 'Local', price: 650, stock: 200, unit: 'cu ft', image: 'https://picsum.photos/seed/gamari/200/200' },
  { id: 4, name: 'Teak Wood', category: 'Hardwood', subCategory: 'Imported', price: 1500, stock: 45, unit: 'cu ft', image: 'https://picsum.photos/seed/teak/200/200' },
  { id: 5, name: 'Plywood (12mm)', category: 'Board', subCategory: 'Waterproof', price: 45, stock: 500, unit: 'sq ft', image: 'https://picsum.photos/seed/plywood/200/200' },
  { id: 6, name: 'MDF Board', category: 'Board', subCategory: 'Standard', price: 35, stock: 320, unit: 'sq ft', image: 'https://picsum.photos/seed/mdf/200/200' },
]

const categories = ['All', 'Hardwood', 'Softwood', 'Board', 'Accessories']

export default function POSWood() {
  const [cart, setCart] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

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
  const tax = subtotal * 0.05
  const total = subtotal + tax

  const filteredProducts = woodProducts.filter(p => 
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
                placeholder="Search wood items..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
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
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <motion.div
                  layout
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-500 transition-all cursor-pointer group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-slate-100 relative">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700 z-10">
                      {product.stock} {product.unit} left
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800">{product.name}</h3>
                  <p className="text-xs text-slate-500 mb-2">{product.category} • {product.subCategory}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-600">${product.price}</span>
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Plus size={18} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Cart/Checkout */}
        <div className="w-full lg:w-[400px] bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ShoppingCart size={20} /> Current Order
              </h2>
              <button 
                onClick={() => setCart([])}
                className="text-rose-500 hover:text-rose-600 text-sm font-semibold"
              >
                Clear All
              </button>
            </div>
            <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
              <option>Walk-in Customer</option>
              <option>Regular Client: Alice Johnson</option>
              <option>Wholesale: Furniture Hub</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <ShoppingCart size={48} strokeWidth={1} />
                  <p>Your cart is empty</p>
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
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 relative">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill
                        className="object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                      <p className="text-xs text-slate-500">${item.price} / {item.unit}</p>
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
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 px-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Printer size={18} /> Bill
              </button>
              <button className="py-3 px-4 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
