'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Image from 'next/image'
import { Search, Plus, Minus, Trash2, Printer, ShoppingCart, Armchair, LayoutGrid, List, Check, UserPlus, RotateCcw, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn, safeParse } from '@/lib/utils'
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
      return safeParse(saved, initialFurnitureProducts);
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
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed')
  const [deliveryCharge, setDeliveryCharge] = useState(0)
  const [paidAmount, setPaidAmount] = useState(0)
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState('Walk-in Customer')
  const [isAddingCustomer, setIsAddingCustomer] = useState(false)
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false)
  const [customerSearchTerm, setCustomerSearchTerm] = useState('')

  useEffect(() => {
    const loadCustomers = () => {
      const saved = localStorage.getItem('customers_list')
      setCustomers(safeParse(saved, []))
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

    // Create Invoice
    const newInvoice = {
      id: `INV-${Date.now()}`,
      customer: selectedCustomer,
      date: new Date().toISOString().split('T')[0],
      deliveryDate: new Date().toISOString().split('T')[0],
      amount: total,
      paid: paidAmount,
      due: Math.max(0, total - paidAmount),
      status: paidAmount >= total ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Due',
      type: 'Furniture',
      discount,
      discountType,
      deliveryCharge,
      items: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      }))
    }

    const savedInvoices = localStorage.getItem('invoices_list')
    const invoices = safeParse(savedInvoices, [])
    localStorage.setItem('invoices_list', JSON.stringify([newInvoice, ...invoices]))

    setProducts(updatedProducts)
    setCart([])
    setIsCheckoutSuccess(true)
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const discountAmount = discountType === 'fixed' ? discount : (subtotal * discount / 100)
  const total = subtotal + deliveryCharge - discountAmount
  const dueAmount = Math.max(0, total - paidAmount)

  const filteredProducts = products.filter(p => 
    (activeCategory === 'All' || p.category === activeCategory) &&
    (activeSubCategory === 'All' || p.subCategory === activeSubCategory) &&
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

          <div className="flex flex-col gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat)
                    setActiveSubCategory('All')
                  }}
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

            {activeCategory !== 'All' && subCategoriesMap[activeCategory] && (
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button
                  onClick={() => setActiveSubCategory('All')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                    activeSubCategory === 'All'
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  All {activeCategory}
                </button>
                {subCategoriesMap[activeCategory].map(sub => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubCategory(sub)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                      activeSubCategory === sub
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-white text-slate-500 border border-slate-200 hover:border-amber-300"
                    )}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
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
          <div className="p-6 bg-slate-900 text-white space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart size={20} /> Current Order
              </h2>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div 
                    className="flex items-center w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 relative z-30"
                  >
                    <Search className="text-slate-400 mr-2 shrink-0" size={14} />
                    <input 
                      type="text"
                      placeholder="Search or Select Customer..."
                      className="bg-transparent outline-none flex-1 text-sm w-full min-w-0 text-white placeholder:text-slate-400"
                      value={isCustomerDropdownOpen ? customerSearchTerm : selectedCustomer}
                      onChange={(e) => {
                        setCustomerSearchTerm(e.target.value)
                        setIsCustomerDropdownOpen(true)
                      }}
                      onFocus={() => {
                        setIsCustomerDropdownOpen(true)
                        setCustomerSearchTerm('')
                      }}
                    />
                    <button 
                      onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                      className="p-1 text-slate-400 hover:text-white shrink-0"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  {isCustomerDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsCustomerDropdownOpen(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto py-1">
                        <div 
                          className="px-4 py-2.5 hover:bg-slate-700 cursor-pointer text-sm text-white font-medium transition-colors"
                          onClick={() => {
                            setSelectedCustomer('Walk-in Customer')
                            setIsCustomerDropdownOpen(false)
                            setCustomerSearchTerm('')
                          }}
                        >
                          Walk-in Customer
                        </div>
                        {customers
                          .filter(c => c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) || c.phone.includes(customerSearchTerm))
                          .map(c => (
                          <div 
                            key={c.id}
                            className="px-4 py-2.5 hover:bg-slate-700 cursor-pointer text-sm text-white transition-colors border-t border-slate-700/50"
                            onClick={() => {
                              setSelectedCustomer(c.name)
                              setIsCustomerDropdownOpen(false)
                              setCustomerSearchTerm('')
                            }}
                          >
                            <div className="font-medium">{c.name}</div>
                            <div className="text-xs text-slate-400">{c.phone}</div>
                          </div>
                        ))}
                        {customers.filter(c => c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) || c.phone.includes(customerSearchTerm)).length === 0 && (
                          <div className="px-4 py-3 text-sm text-slate-400 text-center">
                            No customers found
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <button 
                  onClick={() => setIsAddingCustomer(true)}
                  className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors shadow-sm flex items-center justify-center shrink-0"
                  title="Add New Customer"
                >
                  <UserPlus size={18} />
                </button>
                <button 
                  onClick={() => {
                    setCart([])
                    setSelectedCustomer('Walk-in Customer')
                  }}
                  className="p-2.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm flex items-center justify-center border border-rose-500/30 shrink-0"
                  title="Reset Order"
                >
                  <RotateCcw size={18} />
                </button>
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
                    className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</span>
                        <span className="text-[10px] text-slate-400">({item.quantity} pcs)</span>
                        <span className="text-xs font-bold text-amber-600">= ৳{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-50 rounded text-slate-500"><Minus size={12} /></button>
                      <span className="text-[10px] font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-50 rounded text-slate-500"><Plus size={12} /></button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-slate-600 text-xs">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              
              {/* Discount Section - One Line */}
              <div className="flex items-center justify-between gap-2 py-1 border-y border-slate-200/50">
                <div className="flex items-center gap-1.5 min-w-fit">
                  <span className="text-slate-600 text-xs">Disc.</span>
                  <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
                    <button 
                      onClick={() => setDiscountType('fixed')}
                      className={cn("px-1.5 py-0.5 text-[9px] font-bold rounded", discountType === 'fixed' ? "bg-amber-100 text-amber-700" : "text-slate-400")}
                    >৳</button>
                    <button 
                      onClick={() => setDiscountType('percent')}
                      className={cn("px-1.5 py-0.5 text-[9px] font-bold rounded", discountType === 'percent' ? "bg-amber-100 text-amber-700" : "text-slate-400")}
                    >%</button>
                  </div>
                </div>
                <input 
                  type="number" 
                  className="flex-1 min-w-0 p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-right outline-none focus:border-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                  value={Number.isNaN(discount) ? '' : discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Delivery Charge */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-600 text-xs whitespace-nowrap">Delivery Charge</span>
                <input 
                  type="number" 
                  className="w-20 p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-right outline-none focus:border-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={Number.isNaN(deliveryCharge) ? '' : deliveryCharge}
                  onChange={(e) => setDeliveryCharge(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>Total</span>
                <span>৳{total.toLocaleString()}</span>
              </div>

              {/* Payment Section */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-emerald-600 font-bold text-xs">Paid</span>
                  <input 
                    type="number" 
                    className="w-28 p-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-right font-bold text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={Number.isNaN(paidAmount) ? '' : paidAmount}
                    onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex justify-between text-rose-600 font-bold text-xs">
                  <span>Due</span>
                  <span>৳{dueAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button className="py-4 px-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Printer size={18} /> A4 Print
              </button>
              <button 
                onClick={handleCheckout}
                className="py-4 px-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20"
              >
                Place Order
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
