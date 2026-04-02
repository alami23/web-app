'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Image from 'next/image'
import { Search, Plus, Minus, Trash2, Printer, ShoppingCart, Filter, Pencil, Check, X, Camera, Upload } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { db, auth } from '@/lib/firebase'
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, getDocFromServer, doc } from 'firebase/firestore'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import AddCustomerModal from '@/components/AddCustomerModal'

const initialWoodProducts = [
  { id: 1, name: 'Segun Wood Log', category: 'Hardwood', subCategory: 'Segun', width: 24, length: 12, cft: 3.000000, description: 'Premium grade Segun wood log for furniture', price: 1200, stock: 150, unit: 'cu ft', image: 'https://picsum.photos/seed/segun/200/200' },
  { id: 2, name: 'Mahogany Plank', category: 'Hardwood', subCategory: 'Mahogany', width: 12, length: 8, cft: 0.500000, description: 'Standard mahogany plank, seasoned', price: 950, stock: 80, unit: 'cu ft', image: 'https://picsum.photos/seed/mahogany/200/200' },
  { id: 3, name: 'Gamari Beam', category: 'Softwood', subCategory: 'Gamari', width: 18, length: 10, cft: 1.406250, description: 'Local gamari wood beam for construction', price: 650, stock: 200, unit: 'cu ft', image: 'https://picsum.photos/seed/gamari/200/200' },
  { id: 4, name: 'Teak Square', category: 'Hardwood', subCategory: 'Teak', width: 20, length: 6, cft: 1.041667, description: 'Imported teak wood square block', price: 1500, stock: 45, unit: 'cu ft', image: 'https://picsum.photos/seed/teak/200/200' },
  { id: 5, name: 'Plywood Sheet', category: 'Board', subCategory: 'Plywood', width: 48, length: 8, cft: 8.000000, description: 'Waterproof 12mm plywood sheet', price: 45, stock: 500, unit: 'sq ft', image: 'https://picsum.photos/seed/plywood/200/200' },
  { id: 6, name: 'MDF Board', category: 'Board', subCategory: 'MDF', width: 48, length: 8, cft: 8.000000, description: 'Standard MDF board for interior', price: 35, stock: 320, unit: 'sq ft', image: 'https://picsum.photos/seed/mdf/200/200' },
]

const categoryData: { [key: string]: string[] } = {
  'All': [],
  'Hardwood': ['All', 'Segun', 'Mahogany', 'Teak', 'Chittagong Teak'],
  'Softwood': ['All', 'Gamari', 'Pine', 'Cedar'],
  'Board': ['All', 'Plywood', 'MDF', 'HDF', 'Particle Board'],
  'Accessories': ['All', 'Glue', 'Nails', 'Polish']
}

export default function POSWood() {
  const [products, setProducts] = useState(initialWoodProducts)
  const [cart, setCart] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSubCategory, setSelectedSubCategory] = useState('All')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<any>(null)
  const [customers, setCustomers] = useState<string[]>(['Walk-in Customer'])
  const [isAddingCustomer, setIsAddingCustomer] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState('Walk-in Customer')

  // Firebase Auth & Firestore Sync
  React.useEffect(() => {
    // Test connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();

    // Ensure user is authenticated (anonymously for this demo if not logged in)
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth).catch(console.error);
      }
    });

    // Sync Customers
    const q = query(collection(db, 'customers'), orderBy('name', 'asc'));
    const unsubscribeCustomers = onSnapshot(q, (snapshot) => {
      const customerList = ['Walk-in Customer'];
      snapshot.forEach((doc) => {
        customerList.push(doc.data().name);
      });
      setCustomers(customerList);
    }, (error) => {
      console.error('Firestore Error: ', error);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeCustomers();
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This is now handled in the modal component
  }

  const resetNewCustomer = () => {
    // This is now handled in the modal component
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
      newData.cft = parseFloat(calculatedCFT.toFixed(6))
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
    const matchesSubCategory = selectedSubCategory === 'All' || p.subCategory === selectedSubCategory
    
    return matchesSearch && matchesCategory && matchesSubCategory
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
        {/* Left: Product Selection */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
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
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Sub Category</label>
                <select 
                  disabled={selectedCategory === 'All'}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all disabled:bg-slate-50 disabled:text-slate-400"
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                >
                  {selectedCategory === 'All' ? (
                    <option value="All">Select Category First</option>
                  ) : (
                    categoryData[selectedCategory].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
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
                  <th className="px-6 py-4 font-semibold w-12">No</th>
                  <th className="px-6 py-4 font-semibold w-24">Width</th>
                  <th className="px-6 py-4 font-semibold w-24">Length</th>
                  <th className="px-6 py-4 font-semibold w-20">CFT</th>
                  <th className="px-6 py-4 font-semibold min-w-[200px]">Description</th>
                  <th className="px-6 py-4 font-semibold w-28">Qty</th>
                  <th className="px-6 py-4 font-semibold w-28 text-center">Rate</th>
                  <th className="px-6 py-4 font-semibold text-center w-32">Action</th>
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
                    <td className="px-6 py-4 text-sm font-medium text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {editingId === product.id ? (
                        <input 
                          type="number" 
                          className="w-16 p-1 border border-slate-300 rounded outline-none focus:border-amber-500" 
                          value={editData.width}
                          onChange={(e) => handleEditChange('width', parseFloat(e.target.value))}
                        />
                      ) : `${product.width} in`}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {editingId === product.id ? (
                        <input 
                          type="number" 
                          className="w-16 p-1 border border-slate-300 rounded outline-none focus:border-amber-500" 
                          value={editData.length}
                          onChange={(e) => handleEditChange('length', parseFloat(e.target.value))}
                        />
                      ) : `${product.length} ft`}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {editingId === product.id ? (
                        <input 
                          type="number" 
                          readOnly
                          className="w-32 p-1 border border-slate-200 bg-slate-50 rounded outline-none text-slate-500 cursor-not-allowed" 
                          value={editData.cft.toFixed(6)}
                        />
                      ) : (
                        <span className="font-bold">{product.cft.toFixed(6)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <input 
                          type="text" 
                          className="w-full p-1 border border-slate-300 rounded outline-none focus:border-amber-500 text-sm" 
                          value={editData.description}
                          onChange={(e) => handleEditChange('description', e.target.value)}
                        />
                      ) : (
                        <span className="text-sm text-slate-600">{product.description}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <input 
                          type="number" 
                          className="w-20 p-1 border border-slate-300 rounded outline-none focus:border-amber-500 text-sm" 
                          value={editData.stock}
                          onChange={(e) => handleEditChange('stock', parseInt(e.target.value))}
                        />
                      ) : (
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-xs font-bold",
                          product.stock < 50 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                          {product.stock} {product.unit}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-amber-600 text-center">
                      {editingId === product.id ? (
                        <input 
                          type="number" 
                          className="w-20 p-1 border border-slate-300 rounded outline-none focus:border-amber-500 text-sm" 
                          value={editData.price}
                          onChange={(e) => handleEditChange('price', parseInt(e.target.value))}
                        />
                      ) : `$${product.price}`}
                    </td>
                    <td className="px-6 py-4 text-center">
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
          <AddCustomerModal 
            isOpen={isAddingCustomer} 
            onClose={() => setIsAddingCustomer(false)}
            onSuccess={(name) => setSelectedCustomer(name)}
          />

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
                        <p className="text-[10px] text-slate-500">${item.price} × {item.cft.toFixed(6)} {item.unit}</p>
                        <p className="text-xs font-bold text-amber-600">${(item.price * item.cft * item.quantity).toFixed(2)}</p>
                      </div>
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
