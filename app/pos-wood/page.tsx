'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Image from 'next/image'
import { Search, Plus, Minus, Trash2, Printer, ShoppingCart, Filter, Pencil, Check, X, Camera, Upload, UserPlus, RotateCcw, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn, safeParse } from '@/lib/utils'
import AddCustomerModal from '@/components/AddCustomerModal'

const initialWoodProducts = [
  { id: 1, name: 'Segun Wood Log', category: 'Hardwood', subCategory: '101', carNo: '1', width: 24, length: 12, cft: 3.000000, description: 'Premium grade Segun wood log for furniture', price: 1200, stock: 150, unit: 'cu ft', image: 'https://picsum.photos/seed/segun/200/200' },
  { id: 2, name: 'Mahogany Plank', category: 'Hardwood', subCategory: '102', carNo: '1', width: 12, length: 8, cft: 0.500000, description: 'Standard mahogany plank, seasoned', price: 950, stock: 80, unit: 'cu ft', image: 'https://picsum.photos/seed/mahogany/200/200' },
  { id: 3, name: 'Gamari Beam', category: 'Softwood', subCategory: '201', carNo: '2', width: 18, length: 10, cft: 1.406250, description: 'Local gamari wood beam for construction', price: 650, stock: 200, unit: 'cu ft', image: 'https://picsum.photos/seed/gamari/200/200' },
  { id: 4, name: 'Teak Square', category: 'Hardwood', subCategory: '103', carNo: '2', width: 20, length: 6, cft: 1.041667, description: 'Imported teak wood square block', price: 1500, stock: 45, unit: 'cu ft', image: 'https://picsum.photos/seed/teak/200/200' },
  { id: 5, name: 'Plywood Sheet', category: 'Board', subCategory: '301', carNo: '3', width: 48, length: 8, cft: 8.000000, description: 'Waterproof 12mm plywood sheet', price: 45, stock: 500, unit: 'sq ft', image: 'https://picsum.photos/seed/plywood/200/200' },
  { id: 6, name: 'MDF Board', category: 'Board', subCategory: '401', carNo: '4', width: 48, length: 8, cft: 8.000000, description: 'Standard MDF board for interior', price: 35, stock: 320, unit: 'sq ft', image: 'https://picsum.photos/seed/mdf/200/200' },
  { id: 7, name: 'Pine Plank', category: 'Softwood', subCategory: '202', carNo: '5', width: 10, length: 12, cft: 0.520833, description: 'Seasoned pine plank for framing', price: 450, stock: 120, unit: 'cu ft', image: 'https://picsum.photos/seed/pine/200/200' },
  { id: 8, name: 'Cedar Beam', category: 'Softwood', subCategory: '203', carNo: '5', width: 14, length: 14, cft: 1.190972, description: 'Aromatic cedar beam for closets', price: 850, stock: 60, unit: 'cu ft', image: 'https://picsum.photos/seed/cedar/200/200' },
]

const categoryData: { [key: string]: string[] } = {
  'All': [],
  'Hardwood': [],
  'Softwood': [],
  'Board': [],
  'Accessories': []
}

interface WoodProduct {
  id: number
  name: string
  category: string
  subCategory: string
  carNo: string
  width: number
  length: number
  cft: number
  description: string
  price: number
  stock: number
  unit: string
  image: string
}

export default function POSWood() {
  const [products, setProducts] = useState<WoodProduct[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wood_inventory');
      return safeParse(saved, initialWoodProducts);
    }
    return initialWoodProducts;
  });

  useEffect(() => {
    localStorage.setItem('wood_inventory', JSON.stringify(products));
  }, [products]);

  const [cart, setCart] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSubCategory, setSelectedSubCategory] = useState('All')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<any>(null)

  const [customers, setCustomers] = useState<any[]>([])
  const [isAddingCustomer, setIsAddingCustomer] = useState(false)
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false)
  const [customerSearchTerm, setCustomerSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('Walk-in Customer')
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed')
  const [deliveryCharge, setDeliveryCharge] = useState(0)
  const [paidAmount, setPaidAmount] = useState(0)

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

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id)
    
    if (existing) {
      // If already in cart, don't add again since QTY is not needed for individual wood items
      return
    }

    if (product.stock < 1) {
      return
    }

    setCart([...cart, { ...product, quantity: 1 }])
    setEditingId(null)
    setEditData(null)
  }

  const handleCheckout = () => {
    if (cart.length === 0) return

    // Update products stock
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id)
      if (cartItem) {
        return {
          ...product,
          stock: Math.max(0, product.stock - 1)
        }
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
      type: 'Wood',
      discount,
      discountType,
      deliveryCharge,
      items: cart.map(item => ({
        name: item.name,
        price: item.price,
        cft: item.cft,
        total: item.price * item.cft
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

  const startEditing = (product: any) => {
    setEditingId(product.id)
    setEditData({ ...product })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditData(null)
  }

  const saveEditing = () => {
    setProducts(products.map(p => p.id === editingId ? editData : p))
    setEditingId(null)
    setEditData(null)
  }

  const handleEditChange = (field: string, value: any) => {
    const newData = { ...editData, [field]: value }
    
    // Auto-calculate CFT if width or length changes
    if (field === 'width' || field === 'length') {
      const w = parseFloat(field === 'width' ? value : editData.width) || 0
      const l = parseFloat(field === 'length' ? value : editData.length) || 0
      const calculatedCFT = (w * w * l) / 2304
      newData.cft = parseFloat(calculatedCFT.toFixed(5))
    }
    
    setEditData(newData)
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.cft), 0)
  const discountAmount = discountType === 'fixed' ? discount : (subtotal * discount / 100)
  const total = subtotal + deliveryCharge - discountAmount
  const dueAmount = Math.max(0, total - paidAmount)

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    const matchesSubCategory = selectedSubCategory === 'All' || p.carNo === selectedSubCategory
    
    return matchesSearch && matchesCategory && matchesSubCategory
  })

  const carNumbers = ['All', ...Array.from(new Set(products
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .map(p => p.carNo))).sort()]

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-3 h-[calc(100vh-120px)] overflow-hidden">
        {/* Left: Product Selection */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 items-center sticky top-0 z-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4 -mt-4 mb-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search wood items..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:text-slate-100 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="flex flex-col gap-1 flex-1 md:w-48">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Category</label>
                <select 
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:text-slate-100 transition-all"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setSelectedSubCategory('All')
                    setEditingId(null)
                    setEditData(null)
                  }}
                >
                  {Object.keys(categoryData).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1 flex-1 md:w-48">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Car No</label>
                <select 
                  disabled={selectedCategory === 'All'}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:text-slate-100 transition-all disabled:bg-slate-50 dark:disabled:bg-slate-950 disabled:text-slate-400"
                  value={selectedSubCategory}
                  onChange={(e) => {
                    setSelectedSubCategory(e.target.value)
                    setEditingId(null)
                    setEditData(null)
                  }}
                >
                  {selectedCategory === 'All' ? (
                    <option value="All">Select Category First</option>
                  ) : (
                    carNumbers.map(car => (
                      <option key={car} value={car}>{car}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto pr-2 custom-scrollbar bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-left border-collapse table-auto">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider z-10">
                <tr>
                  <th className="px-3 py-2 font-semibold w-12 text-center">No</th>
                  <th className="px-1 py-2 font-semibold w-14">Car</th>
                  <th className="px-2 py-2 font-semibold w-24">Tree No</th>
                  <th className="px-3 py-2 font-semibold w-20">Width</th>
                  <th className="px-3 py-2 font-semibold w-20">Length</th>
                  <th className="px-3 py-2 font-semibold w-28">CFT</th>
                  <th className="px-2 py-2 font-semibold">Description</th>
                  <th className="px-1 py-2 font-semibold w-14 text-center">Rate</th>
                  <th className="px-1 py-2 font-semibold text-center w-28">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.map((product, index) => (
                  <tr 
                    key={product.id} 
                    className={cn(
                      "transition-colors group",
                      editingId === product.id ? "bg-amber-50 dark:bg-amber-900/20" : "hover:bg-amber-50/30 dark:hover:bg-amber-900/10"
                    )}
                  >
                    <td className="px-3 py-2 text-[10px] font-medium text-slate-400 dark:text-slate-500 text-center">{index + 1}</td>
                    <td className="px-1 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {editingId === product.id ? (
                        <input 
                          type="text" 
                          className="w-10 p-0.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded outline-none focus:border-amber-500 text-[10px] dark:text-slate-100" 
                          value={editData.carNo}
                          onChange={(e) => handleEditChange('carNo', e.target.value)}
                        />
                      ) : product.carNo}
                    </td>
                    <td className="px-2 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {editingId === product.id ? (
                        <input 
                          type="text" 
                          className="w-full p-0.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded outline-none focus:border-amber-500 text-[10px] dark:text-slate-100" 
                          value={editData.subCategory}
                          onChange={(e) => handleEditChange('subCategory', e.target.value)}
                        />
                      ) : product.subCategory}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {editingId === product.id ? (
                        <input 
                          type="number" 
                          className="w-14 p-0.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded outline-none focus:border-amber-500 text-[10px] dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                          value={Number.isNaN(editData.width) ? '' : editData.width}
                          onChange={(e) => handleEditChange('width', parseFloat(e.target.value))}
                        />
                      ) : `${product.width}"`}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {editingId === product.id ? (
                        <input 
                          type="number" 
                          className="w-14 p-0.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded outline-none focus:border-amber-500 text-[10px] dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                          value={Number.isNaN(editData.length) ? '' : editData.length}
                          onChange={(e) => handleEditChange('length', parseFloat(e.target.value))}
                        />
                      ) : `${product.length}'`}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {editingId === product.id ? (
                        <input 
                          type="number" 
                          readOnly
                          className="w-24 p-0.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded outline-none text-slate-500 dark:text-slate-400 cursor-not-allowed text-[10px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                          value={Number.isNaN(editData.cft) ? '' : editData.cft.toFixed(5)}
                        />
                      ) : (
                        <span className="font-bold">{product.cft.toFixed(5)}</span>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {editingId === product.id ? (
                        <input 
                          type="text" 
                          className="w-full p-0.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded outline-none focus:border-amber-500 text-[10px] dark:text-slate-100" 
                          value={editData.description}
                          onChange={(e) => handleEditChange('description', e.target.value)}
                        />
                      ) : (
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-1">{product.description}</span>
                      )}
                    </td>
                    <td className="px-1 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 text-center">
                      {editingId === product.id ? (
                        <input 
                          type="number" 
                          className="w-20 p-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded outline-none focus:border-amber-500 text-xs text-center font-bold dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                          value={Number.isNaN(editData.price) ? '' : editData.price}
                          onChange={(e) => handleEditChange('price', parseInt(e.target.value))}
                        />
                      ) : `৳${product.price}`}
                    </td>
                    <td className="px-1 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {editingId === product.id ? (
                          <>
                            <button 
                              onClick={saveEditing}
                              className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                              title="Save Changes"
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={cancelEditing}
                              className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => startEditing(product)}
                              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
                              title="Edit Product"
                            >
                              <Pencil size={18} />
                            </button>
                            <button 
                              onClick={() => addToCart(product)}
                              className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white transition-all shadow-sm group-hover:shadow-md"
                              title="Add to Cart"
                            >
                              <Plus size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p>No wood items found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart/Checkout */}
        <div className="w-full lg:w-[320px] xl:w-[360px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <ShoppingCart size={20} /> Current Order
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div 
                    className="flex items-center w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 relative z-30"
                  >
                    <Search className="text-slate-400 mr-2 shrink-0" size={14} />
                    <input 
                      type="text"
                      placeholder="Search or Select Customer..."
                      className="bg-transparent outline-none flex-1 text-sm w-full min-w-0 dark:text-slate-100"
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
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  {isCustomerDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsCustomerDropdownOpen(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto py-1">
                        <div 
                          className="px-4 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer text-sm text-slate-700 dark:text-slate-200 font-medium transition-colors"
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
                            className="px-4 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer text-sm text-slate-700 dark:text-slate-200 transition-colors border-t border-slate-50 dark:border-slate-700"
                            onClick={() => {
                              setSelectedCustomer(c.name)
                              setIsCustomerDropdownOpen(false)
                              setCustomerSearchTerm('')
                            }}
                          >
                            <div className="font-medium">{c.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{c.phone}</div>
                          </div>
                        ))}
                        {customers.filter(c => c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) || c.phone.includes(customerSearchTerm)).length === 0 && (
                          <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">
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
                  className="p-2.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0"
                  title="Reset Order"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Add Customer Modal */}
          <AddCustomerModal 
            isOpen={isAddingCustomer}
            onClose={() => setIsAddingCustomer(false)}
            onAdd={handleAddCustomer}
          />


          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-2">
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
                    className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{item.subCategory}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">({item.width}*{item.length})</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">= ৳{(item.price * item.cft).toFixed(2)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-xs">
                <span>Subtotal</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              
              {/* Discount Section - One Line */}
              <div className="flex items-center justify-between gap-2 py-1 border-y border-slate-200/50 dark:border-slate-800">
                <div className="flex items-center gap-1.5 min-w-fit">
                  <span className="text-slate-600 dark:text-slate-400 text-xs">Disc.</span>
                  <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
                    <button 
                      onClick={() => setDiscountType('fixed')}
                      className={cn("px-1.5 py-0.5 text-[9px] font-bold rounded", discountType === 'fixed' ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400" : "text-slate-400 dark:text-slate-500")}
                    >৳</button>
                    <button 
                      onClick={() => setDiscountType('percent')}
                      className={cn("px-1.5 py-0.5 text-[9px] font-bold rounded", discountType === 'percent' ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400" : "text-slate-400 dark:text-slate-500")}
                    >%</button>
                  </div>
                </div>
                <input 
                  type="number" 
                  className="w-40 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-right outline-none focus:border-amber-500 dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                  value={discount === 0 ? '' : discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Delivery Charge */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">Delivery</span>
                <input 
                  type="number" 
                  className="w-40 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-right outline-none focus:border-amber-500 dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                  value={deliveryCharge === 0 ? '' : deliveryCharge}
                  onChange={(e) => setDeliveryCharge(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100 pt-1 border-t border-slate-200 dark:border-slate-800">
                <span>Total</span>
                <span>৳{total.toFixed(2)}</span>
              </div>

              {/* Payment Section */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">Paid</span>
                  <input 
                    type="number" 
                    className="w-40 p-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-lg text-sm text-right font-bold text-emerald-700 dark:text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                    value={paidAmount === 0 ? '' : paidAmount}
                    onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold text-xs">
                  <span>Due</span>
                  <span>৳{dueAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button className="py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                <Printer size={18} /> Bill
              </button>
              <button 
                onClick={handleCheckout}
                className="py-3 px-4 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>

        {/* Checkout Success Modal */}
        <AnimatePresence>
          {isCheckoutSuccess && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center"
              >
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Sale Complete!</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8">The wood inventory has been automatically updated and the invoice is ready.</p>
                <button 
                  onClick={() => setIsCheckoutSuccess(false)}
                  className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-lg shadow-slate-900/20"
                >
                  Continue
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
