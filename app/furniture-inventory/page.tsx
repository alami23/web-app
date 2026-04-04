'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Search, 
  Plus, 
  Armchair, 
  Edit2, 
  Trash2, 
  ShoppingBag, 
  Filter,
  MoreVertical,
  ArrowUpDown,
  Download,
  Upload,
  Check,
  X,
  Camera,
  LayoutGrid,
  List
} from 'lucide-react'
import { cn, safeParse } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'

interface FurnitureProduct {
  id: number
  name: string
  category: string
  price: number
  stock: number
  image: string
  description: string
  sku: string
}

const initialFurnitureProducts: FurnitureProduct[] = [
  { id: 1, name: 'Royal King Size Bed', category: 'Bed', price: 45000, stock: 5, image: 'https://picsum.photos/seed/bed1/400/400', description: 'Premium king size bed with teak wood finish', sku: 'FUR-BED-001' },
  { id: 2, name: 'Modern Velvet Sofa', category: 'Sofa', price: 32000, stock: 8, image: 'https://picsum.photos/seed/sofa1/400/400', description: '3-seater velvet sofa with ergonomic design', sku: 'FUR-SOF-002' },
  { id: 3, name: 'Classic Dining Table', category: 'Dining', price: 28000, stock: 4, image: 'https://picsum.photos/seed/dining1/400/400', description: '6-seater solid wood dining table', sku: 'FUR-DIN-003' },
  { id: 4, name: 'Ergonomic Office Chair', category: 'Chair', price: 12000, stock: 15, image: 'https://picsum.photos/seed/chair1/400/400', description: 'High-back office chair with lumbar support', sku: 'FUR-CHR-004' },
  { id: 5, name: 'Wooden Wardrobe', category: 'Wardrobe', price: 38000, stock: 3, image: 'https://picsum.photos/seed/wardrobe1/400/400', description: '4-door wooden wardrobe with mirror', sku: 'FUR-WAR-005' },
  { id: 6, name: 'Dressing Table', category: 'Dressing', price: 15000, stock: 6, image: 'https://picsum.photos/seed/dressing1/400/400', description: 'Elegant dressing table with multiple drawers', sku: 'FUR-DRS-006' },
]

export default function FurnitureInventoryPage() {
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

  const [searchTerm, setSearchTerm] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
  const [formData, setFormData] = useState<Partial<FurnitureProduct>>({
    name: '',
    category: 'Bed',
    price: 0,
    stock: 0,
    image: 'https://picsum.photos/seed/furniture/400/400',
    description: '',
    sku: ''
  })

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const newData = { ...formData, [name]: value }

    // Clear SKU if category changes
    if (name === 'category') {
      newData.sku = ''
    }

    setFormData(newData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...p, ...formData } as FurnitureProduct : p))
      setEditingId(null)
    } else {
      const newProduct = {
        ...formData,
        id: Math.max(0, ...products.map(p => p.id)) + 1
      } as FurnitureProduct
      setProducts([...products, newProduct])
      setIsAdding(false)
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Bed',
      price: 0,
      stock: 0,
      image: 'https://picsum.photos/seed/furniture/400/400',
      description: '',
      sku: ''
    })
  }

  const handleEdit = (product: FurnitureProduct) => {
    setFormData(product)
    setEditingId(product.id)
    setIsAdding(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this furniture item?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Furniture Inventory</h1>
            <p className="text-slate-500">Manage your furniture catalog, stock levels, and pricing.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-2 rounded-lg transition-colors", viewMode === 'grid' ? "bg-slate-100 text-amber-600" : "text-slate-400")}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={cn("p-2 rounded-lg transition-colors", viewMode === 'table' ? "bg-slate-100 text-amber-600" : "text-slate-400")}
              >
                <List size={18} />
              </button>
            </div>
            <button 
              onClick={() => {
                resetForm()
                setEditingId(null)
                setIsAdding(true)
                setSearchTerm('')
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
            >
              <Plus size={18} /> Add Furniture
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, category, or SKU..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-all">
              <Filter size={18} /> Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-all">
              <Download size={18} /> Export
            </button>
          </div>
        </div>

        {/* Inventory View */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">SKU</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Stock</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 relative">
                            <Image 
                              src={product.image} 
                              alt={product.name} 
                              fill
                              className="object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{product.name}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                            "text-sm font-bold",
                            product.stock < 5 ? "text-rose-600" : "text-slate-900"
                          )}>
                            {product.stock} units
                          </span>
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                product.stock < 5 ? "bg-rose-500" : "bg-emerald-500"
                              )}
                              style={{ width: `${Math.min(100, (product.stock / 20) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        ৳{product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-amber-600 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl transition-all">
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-amber-600 shadow-sm transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 hover:text-rose-600 shadow-sm transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">{product.category}</p>
                      <h3 className="font-bold text-slate-800 mt-1">{product.name}</h3>
                    </div>
                    <p className="font-bold text-slate-900">৳{product.price.toLocaleString()}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-mono">{product.sku}</p>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded",
                      product.stock > 5 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    )}>
                      {product.stock} IN STOCK
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {isAdding && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAdding(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h2 className="text-xl font-bold text-slate-800">
                    {editingId ? 'Edit Furniture' : 'Add New Furniture'}
                  </h2>
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="p-2 hover:bg-white rounded-xl text-slate-400 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Furniture Name</label>
                      <input 
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        placeholder="e.g. Royal King Size Bed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">SKU Code</label>
                      <input 
                        required
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        placeholder="e.g. FUR-BED-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Category</label>
                      <select 
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      >
                        <option value="Bed">Bed</option>
                        <option value="Sofa">Sofa</option>
                        <option value="Dining">Dining</option>
                        <option value="Chair">Chair</option>
                        <option value="Wardrobe">Wardrobe</option>
                        <option value="Dressing">Dressing</option>
                        <option value="Office">Office</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Price (৳)</label>
                      <input 
                        required
                        type="number"
                        name="price"
                        value={Number.isNaN(formData.price) ? '' : formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Stock Quantity</label>
                      <input 
                        required
                        type="number"
                        name="stock"
                        value={Number.isNaN(formData.stock) ? '' : formData.stock}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                    <div className="col-span-full space-y-2">
                      <label className="text-sm font-bold text-slate-700">Description</label>
                      <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all min-h-[100px]"
                        placeholder="Add some details about this furniture item..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20"
                    >
                      {editingId ? 'Update Furniture' : 'Save Furniture'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
