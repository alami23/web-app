'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Image from 'next/image'
import { Search, Plus, Minus, Trash2, Printer, ShoppingCart, Filter, Pencil, Check, X, Camera, Upload } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

const initialWoodProducts = [
  { id: 1, name: 'Segun Wood Log', category: 'Hardwood', subCategory: 'Segun', carNo: '1', width: 24, length: 12, cft: 3.000000, description: 'Premium grade Segun wood log for furniture', price: 1200, stock: 150, unit: 'cu ft', image: 'https://picsum.photos/seed/segun/200/200' },
  { id: 2, name: 'Mahogany Plank', category: 'Hardwood', subCategory: 'Mahogany', carNo: '1', width: 12, length: 8, cft: 0.500000, description: 'Standard mahogany plank, seasoned', price: 950, stock: 80, unit: 'cu ft', image: 'https://picsum.photos/seed/mahogany/200/200' },
  { id: 3, name: 'Gamari Beam', category: 'Softwood', subCategory: 'Gamari', carNo: '2', width: 18, length: 10, cft: 1.406250, description: 'Local gamari wood beam for construction', price: 650, stock: 200, unit: 'cu ft', image: 'https://picsum.photos/seed/gamari/200/200' },
  { id: 4, name: 'Teak Square', category: 'Hardwood', subCategory: 'Teak', carNo: '2', width: 20, length: 6, cft: 1.041667, description: 'Imported teak wood square block', price: 1500, stock: 45, unit: 'cu ft', image: 'https://picsum.photos/seed/teak/200/200' },
  { id: 5, name: 'Plywood Sheet', category: 'Board', subCategory: 'Plywood', carNo: '3', width: 48, length: 8, cft: 8.000000, description: 'Waterproof 12mm plywood sheet', price: 45, stock: 500, unit: 'sq ft', image: 'https://picsum.photos/seed/plywood/200/200' },
  { id: 6, name: 'MDF Board', category: 'Board', subCategory: 'MDF', carNo: '4', width: 48, length: 8, cft: 8.000000, description: 'Standard MDF board for interior', price: 35, stock: 320, unit: 'sq ft', image: 'https://picsum.photos/seed/mdf/200/200' },
  { id: 7, name: 'Pine Plank', category: 'Softwood', subCategory: 'Pine', carNo: '5', width: 10, length: 12, cft: 0.520833, description: 'Seasoned pine plank for framing', price: 450, stock: 120, unit: 'cu ft', image: 'https://picsum.photos/seed/pine/200/200' },
  { id: 8, name: 'Cedar Beam', category: 'Softwood', subCategory: 'Cedar', carNo: '5', width: 14, length: 14, cft: 1.190972, description: 'Aromatic cedar beam for closets', price: 850, stock: 60, unit: 'cu ft', image: 'https://picsum.photos/seed/cedar/200/200' },
]

const categoryData: { [key: string]: string[] } = {
  'All': [],
  'Hardwood': [],
  'Softwood': [],
  'Board': [],
  'Accessories': []
}

export default function POSWood() {
  const [products, setProducts] = useState(initialWoodProducts)
  const [cart, setCart] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSubCategory, setSelectedSubCategory] = useState('All')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<any>(null)
  const [customers, setCustomers] = useState(['Walk-in Customer', 'Regular Client: Alice Johnson', 'Wholesale: Furniture Hub'])
  const [isAddingCustomer, setIsAddingCustomer] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState('Walk-in Customer')
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    photo: null as string | null
  })

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewCustomer({ ...newCustomer, photo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const resetNewCustomer = () => {
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: '',
      photo: null
    })
  }

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

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.cft * item.quantity), 0)
  const tax = subtotal * 0.05
  const total = subtotal + tax

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    const matchesSubCategory = selectedSubCategory === 'All' || p.carNo === selectedSubCategory
    
    return matchesSearch && matchesCategory && matchesSubCategory
  })

  const carNumbers = ['All', ...Array.from(new Set(products
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .map(p => p.carNo)))].sort()

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-3 h-[calc(100vh-120px)] overflow-hidden">
        {/* Left: Product Selection */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 items-center sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md py-4 -mt-4 mb-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search wood items..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="flex flex-col gap-1 flex-1 md:w-48">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Category</label>
                <select 
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setSelectedSubCategory('All')
                  }}
                >
                  {Object.keys(categoryData).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1 flex-1 md:w-48">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Car No</label>
                <select 
                  disabled={selectedCategory === 'All'}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all disabled:bg-slate-50 disabled:text-slate-400"
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
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

          <div className="flex-1 overflow-auto pr-2 custom-scrollbar bg-white rounded-3xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse table-auto">
              <thead className="sticky top-0 bg-slate-50 text-slate-500 text-xs uppercase tracking-wider z-10">
                <tr>
                  <th className="px-3 py-2 font-semibold w-12 text-center">No</th>
                  <th className="px-3 py-2 font-semibold w-20">Width</th>
                  <th className="px-3 py-2 font-semibold w-20">Length</th>
                  <th className="px-3 py-2 font-semibold w-28">CFT</th>
                  <th className="px-2 py-2 font-semibold">Description</th>
                  <th className="px-1 py-2 font-semibold w-14">Car</th>
                  <th className="px-1 py-2 font-semibold w-14">Qty</th>
                  <th className="px-1 py-2 font-semibold w-16 text-center">Rate</th>
                  <th className="px-1 py-2 font-semibold text-center w-28">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product, index) => (
                  <tr 
                    key={product.id} 
                    className={cn(
                      "transition-colors group",
                      editingId === product.id ? "bg-amber-50" : "hover:bg-amber-50/30"
                    )}
                  >
                    <td className="px-3 py-2 text-[10px] font-medium text-slate-400 text-center">{index + 1}</td>
                    <td className="px-3 py-2 text-xs text-slate-600 font-medium">
                      {editingId === product.id ? (
                        <input 
                          type="number" 
                          className="w-14 p-0.5 border border-slate-300 rounded outline-none focus:border-amber-500 text-[10px]" 
                          value={editData.width}
                          onChange={(e) => handleEditChange('width', parseFloat(e.target.value))}
                        />
                      ) : `${product.width}"`}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600 font-medium">
                      {editingId === product.id ? (
                        <input 
                          type="number" 
                          className="w-14 p-0.5 border border-slate-300 rounded outline-none focus:border-amber-500 text-[10px]" 
                          value={editData.length}
                          onChange={(e) => handleEditChange('length', parseFloat(e.target.value))}
                        />
                      ) : `${product.length}'`}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600 font-medium">
                      {editingId === product.id ? (
                        <input 
                          type="number" 
                          readOnly
                          className="w-24 p-0.5 border border-slate-200 bg-slate-50 rounded outline-none text-slate-500 cursor-not-allowed text-[10px]" 
                          value={editData.cft.toFixed(5)}
                        />
                      ) : (
                        <span className="font-bold">{product.cft.toFixed(5)}</span>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {editingId === product.id ? (
                        <input 
                          type="text" 
                          className="w-full p-0.5 border border-slate-300 rounded outline-none focus:border-amber-500 text-[10px]" 
                          value={editData.description}
                          onChange={(e) => handleEditChange('description', e.target.value)}
                        />
                      ) : (
                        <span className="text-[10px] text-slate-600 line-clamp-1">{product.description}</span>
                      )}
                    </td>
                    <td className="px-1 py-2 text-xs text-slate-600 font-medium">
                      {editingId === product.id ? (
                        <input 
                          type="text" 
                          className="w-10 p-0.5 border border-slate-300 rounded outline-none focus:border-amber-500 text-[10px]" 
                          value={editData.carNo}
                          onChange={(e) => handleEditChange('carNo', e.target.value)}
                        />
                      ) : product.carNo}
                    </td>
                    <td className="px-1 py-2">
                      {editingId === product.id ? (
                        <input 
                          type="number" 
                          className="w-12 p-0.5 border border-slate-300 rounded outline-none focus:border-amber-500 text-[10px]" 
                          value={editData.stock}
                          onChange={(e) => handleEditChange('stock', parseInt(e.target.value))}
                        />
                      ) : (
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-lg text-[10px] font-bold",
                          product.stock < 50 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                          {product.stock}
                        </span>
                      )}
                    </td>
                    <td className="px-1 py-2 text-xs font-bold text-amber-600 text-center">
                      {editingId === product.id ? (
                        <input 
                          type="number" 
                          className="w-12 p-0.5 border border-slate-300 rounded outline-none focus:border-amber-500 text-[10px]" 
                          value={editData.price}
                          onChange={(e) => handleEditChange('price', parseInt(e.target.value))}
                        />
                      ) : `$${product.price}`}
                    </td>
                    <td className="px-1 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {editingId === product.id ? (
                          <>
                            <button 
                              onClick={saveEditing}
                              className="p-2 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                              title="Save Changes"
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={cancelEditing}
                              className="p-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => startEditing(product)}
                              className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all shadow-sm"
                              title="Edit Product"
                            >
                              <Pencil size={18} />
                            </button>
                            <button 
                              onClick={() => addToCart(product)}
                              className="p-2 bg-amber-100 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm group-hover:shadow-md"
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
              <div className="p-12 text-center text-slate-400">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p>No wood items found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart/Checkout */}
        <div className="w-full lg:w-[320px] xl:w-[360px] bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ShoppingCart size={20} /> Current Order
              </h2>
              <button 
                onClick={() => {
                  setCart([])
                  setSelectedCustomer('Walk-in Customer')
                }}
                className="text-rose-500 hover:text-rose-600 text-sm font-semibold"
              >
                Clear All
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select 
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 transition-colors"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                {customers.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button 
                onClick={() => setIsAddingCustomer(true)}
                className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors shadow-sm flex items-center justify-center"
                title="Add New Customer"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Add Customer Modal */}
          <AnimatePresence>
            {isAddingCustomer && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                >
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">Add New Customer</h3>
                    <button onClick={() => { setIsAddingCustomer(false); resetNewCustomer(); }} className="text-slate-400 hover:text-slate-600">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {/* Photo Upload */}
                    <div className="flex flex-col items-center justify-center gap-3 mb-2">
                      <div className="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group">
                        {newCustomer.photo ? (
                          <Image 
                            src={newCustomer.photo} 
                            alt="Preview" 
                            fill 
                            className="object-cover" 
                          />
                        ) : (
                          <Camera size={32} className="text-slate-300" />
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <Upload size={20} className="text-white" />
                          <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                        </label>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload Profile Photo</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name *</label>
                        <input 
                          type="text" 
                          autoFocus
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-colors text-sm"
                          placeholder="John Doe"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number *</label>
                        <input 
                          type="tel" 
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-colors text-sm"
                          placeholder="+880 1XXX XXXXXX"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address (Optional)</label>
                      <input 
                        type="email" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-colors text-sm"
                        placeholder="john@example.com"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address</label>
                      <textarea 
                        rows={2}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 transition-colors text-sm resize-none"
                        placeholder="Enter street address, city..."
                        value={newCustomer.address}
                        onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => { setIsAddingCustomer(false); resetNewCustomer(); }}
                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        disabled={!newCustomer.name.trim() || !newCustomer.phone.trim()}
                        onClick={() => {
                          if (newCustomer.name.trim() && newCustomer.phone.trim()) {
                            const displayName = newCustomer.name.trim()
                            setCustomers([...customers, displayName])
                            setSelectedCustomer(displayName)
                            resetNewCustomer()
                            setIsAddingCustomer(false)
                          }
                        }}
                        className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/20"
                      >
                        Save Customer
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

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
                      <div className="flex flex-col">
                        <p className="text-[10px] text-slate-500">${item.price} × {item.cft.toFixed(5)} {item.unit}</p>
                        <p className="text-xs font-bold text-amber-600">${(item.price * item.cft * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-white rounded-lg shadow-sm text-slate-600 transition-all active:scale-95"><Minus size={16} /></button>
                      <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-white rounded-lg shadow-sm text-slate-600 transition-all active:scale-95"><Plus size={16} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={20} /></button>
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
