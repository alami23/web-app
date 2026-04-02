'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Search, 
  Plus, 
  Trees, 
  Edit2, 
  Trash2, 
  Box, 
  Filter,
  MoreVertical,
  ArrowUpDown,
  Download,
  Upload,
  Check,
  X,
  Camera
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'

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

const initialWoodProducts: WoodProduct[] = [
  { id: 1, name: 'Segun Wood Log', category: 'Hardwood', subCategory: 'Segun', carNo: '1', width: 24, length: 12, cft: 3.00000, description: 'Premium grade Segun wood log for furniture', price: 1200, stock: 150, unit: 'cu ft', image: 'https://picsum.photos/seed/segun/200/200' },
  { id: 2, name: 'Mahogany Plank', category: 'Hardwood', subCategory: 'Mahogany', carNo: '1', width: 12, length: 8, cft: 0.50000, description: 'Standard mahogany plank, seasoned', price: 950, stock: 80, unit: 'cu ft', image: 'https://picsum.photos/seed/mahogany/200/200' },
  { id: 3, name: 'Gamari Beam', category: 'Softwood', subCategory: 'Gamari', carNo: '2', width: 18, length: 10, cft: 1.40625, description: 'Local gamari wood beam for construction', price: 650, stock: 200, unit: 'cu ft', image: 'https://picsum.photos/seed/gamari/200/200' },
  { id: 4, name: 'Teak Square', category: 'Hardwood', subCategory: 'Teak', carNo: '2', width: 20, length: 6, cft: 1.04167, description: 'Imported teak wood square block', price: 1500, stock: 45, unit: 'cu ft', image: 'https://picsum.photos/seed/teak/200/200' },
  { id: 5, name: 'Plywood Sheet', category: 'Board', subCategory: 'Plywood', carNo: '3', width: 48, length: 8, cft: 8.00000, description: 'Waterproof 12mm plywood sheet', price: 45, stock: 500, unit: 'sq ft', image: 'https://picsum.photos/seed/plywood/200/200' },
  { id: 6, name: 'MDF Board', category: 'Board', subCategory: 'MDF', carNo: '4', width: 48, length: 8, cft: 8.00000, description: 'Standard MDF board for interior', price: 35, stock: 320, unit: 'sq ft', image: 'https://picsum.photos/seed/mdf/200/200' },
  { id: 7, name: 'Pine Plank', category: 'Softwood', subCategory: 'Pine', carNo: '5', width: 10, length: 12, cft: 0.52083, description: 'Seasoned pine plank for framing', price: 450, stock: 120, unit: 'cu ft', image: 'https://picsum.photos/seed/pine/200/200' },
  { id: 8, name: 'Cedar Beam', category: 'Softwood', subCategory: 'Cedar', carNo: '5', width: 14, length: 14, cft: 1.19097, description: 'Aromatic cedar beam for closets', price: 850, stock: 60, unit: 'cu ft', image: 'https://picsum.photos/seed/cedar/200/200' },
]

export default function WoodInventoryPage() {
  const [products, setProducts] = useState<WoodProduct[]>(initialWoodProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<WoodProduct>>({
    name: '',
    category: 'Hardwood',
    subCategory: '',
    carNo: '',
    width: 0,
    length: 0,
    cft: 0,
    description: '',
    price: 0,
    stock: 0,
    unit: 'cu ft',
    image: 'https://picsum.photos/seed/wood/200/200'
  })

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.carNo.includes(searchTerm)
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const newData = { ...formData, [name]: value }

    // Auto-calculate CFT if width or length changes
    if (name === 'width' || name === 'length') {
      const w = parseFloat(name === 'width' ? value : (formData.width?.toString() || '0')) || 0
      const l = parseFloat(name === 'length' ? value : (formData.length?.toString() || '0')) || 0
      newData.cft = parseFloat(((w * w * l) / 2304).toFixed(5))
    }

    setFormData(newData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...p, ...formData } as WoodProduct : p))
      setEditingId(null)
    } else {
      const newProduct = {
        ...formData,
        id: Math.max(0, ...products.map(p => p.id)) + 1
      } as WoodProduct
      setProducts([...products, newProduct])
      setIsAdding(false)
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Hardwood',
      carNo: '',
      width: 0,
      length: 0,
      cft: 0,
      description: '',
      price: 0,
      stock: 0,
      unit: 'cu ft',
      image: 'https://picsum.photos/seed/wood/200/200'
    })
  }

  const handleEdit = (product: WoodProduct) => {
    setFormData(product)
    setEditingId(product.id)
    setIsAdding(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Wood Inventory</h1>
            <p className="text-slate-500">Manage your wood stock, dimensions, and pricing.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
              <Download size={18} /> Export
            </button>
            <button 
              onClick={() => {
                resetForm()
                setEditingId(null)
                setIsAdding(true)
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
            >
              <Plus size={18} /> Add Wood Item
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, category, or car no..." 
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
              <ArrowUpDown size={18} /> Sort
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Car No</th>
                  <th className="px-6 py-4 font-semibold">Dimensions (W&quot; x L&apos;)</th>
                  <th className="px-6 py-4 font-semibold">CFT</th>
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
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 relative">
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
                          <p className="text-xs text-slate-500 truncate max-w-[150px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {product.carNo}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {product.width}&quot; x {product.length}&apos;
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-amber-600">
                      {product.cft.toFixed(5)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={cn(
                          "text-sm font-bold",
                          product.stock < 50 ? "text-rose-600" : "text-slate-900"
                        )}>
                          {product.stock} {product.unit}
                        </span>
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              product.stock < 50 ? "bg-rose-500" : "bg-emerald-500"
                            )}
                            style={{ width: `${Math.min(100, (product.stock / 500) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      ${product.price}
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
                    {editingId ? 'Edit Wood Item' : 'Add New Wood Item'}
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
                      <label className="text-sm font-bold text-slate-700">Product Name</label>
                      <input 
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        placeholder="e.g. Segun Wood Log"
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
                        <option value="Hardwood">Hardwood</option>
                        <option value="Softwood">Softwood</option>
                        <option value="Board">Board</option>
                        <option value="Accessory">Accessory</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Sub Category</label>
                      <input 
                        type="text"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        placeholder="e.g. Segun"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Car No</label>
                      <input 
                        type="text"
                        name="carNo"
                        value={formData.carNo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        placeholder="e.g. 1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Unit</label>
                      <select 
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      >
                        <option value="cu ft">Cubic Feet (cu ft)</option>
                        <option value="sq ft">Square Feet (sq ft)</option>
                        <option value="pcs">Pieces (pcs)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Width (inches)</label>
                      <input 
                        type="number"
                        name="width"
                        value={formData.width}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Length (feet)</label>
                      <input 
                        type="number"
                        name="length"
                        value={formData.length}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">CFT (Auto-calculated)</label>
                      <input 
                        readOnly
                        type="number"
                        name="cft"
                        value={formData.cft}
                        className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Price per Unit</label>
                      <input 
                        required
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Initial Stock</label>
                      <input 
                        required
                        type="number"
                        name="stock"
                        value={formData.stock}
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
                        placeholder="Add some details about this wood item..."
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
                      {editingId ? 'Update Item' : 'Save Item'}
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
