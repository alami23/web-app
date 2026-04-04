'use client'

import React, { useState } from 'react'
import { X, Camera, User, Phone, MapPin, Mail, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { safeParse } from '@/lib/utils'

interface AddCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd?: (customer: any) => void
}

export default function AddCustomerModal({ isOpen, onClose, onAdd }: AddCustomerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    type: 'Regular',
    initialBalance: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCustomer = {
      id: `CUS-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      ...formData,
      totalOrders: 0,
      totalDue: formData.initialBalance,
      lastPurchase: 'New Customer',
      photo: null
    }
    
    if (onAdd) {
      onAdd(newCustomer)
    } else {
      // Fallback: save to localStorage if no onAdd provided
      const saved = localStorage.getItem('customers_list')
      const current = safeParse(saved, [])
      localStorage.setItem('customers_list', JSON.stringify([...current, newCustomer]))
      window.dispatchEvent(new Event('storage')) // Trigger update in other components
    }
    
    onClose()
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      type: 'Regular',
      initialBalance: 0
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-600/20">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Add New Customer</h2>
              <p className="text-xs text-slate-500">Create a new profile in your directory</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-all shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-amber-500 group-hover:text-amber-500 transition-all cursor-pointer overflow-hidden">
                <Camera size={32} strokeWidth={1.5} />
              </div>
              <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-600 hover:text-amber-600 transition-all">
                <Plus size={16} />
              </button>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">Upload Photo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User size={14} className="text-amber-600" /> Full Name
              </label>
              <input 
                required
                type="text"
                value={formData.name}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-sm"
                placeholder="Enter customer name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Phone size={14} className="text-amber-600" /> Phone Number
              </label>
              <input 
                required
                type="tel"
                value={formData.phone}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-sm"
                placeholder="e.g. 017XXXXXXXX"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Mail size={14} className="text-amber-600" /> Email Address (Optional)
              </label>
              <input 
                type="email"
                value={formData.email}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-sm"
                placeholder="customer@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Customer Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-sm"
              >
                <option value="Regular">Regular Customer</option>
                <option value="Premium">Premium Member</option>
                <option value="Wholesale">Wholesale Client</option>
              </select>
            </div>

            <div className="col-span-full space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MapPin size={14} className="text-amber-600" /> Full Address
              </label>
              <textarea 
                required
                value={formData.address}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-sm min-h-[100px] resize-none"
                placeholder="Enter complete address details..."
              />
            </div>

            <div className="col-span-full space-y-2">
              <label className="text-sm font-bold text-slate-700">Initial Opening Balance (৳)</label>
              <input 
                type="number"
                value={Number.isNaN(formData.initialBalance) ? '' : formData.initialBalance}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setFormData({...formData, initialBalance: parseFloat(e.target.value) || 0})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-sm"
                placeholder="0.00"
              />
              <p className="text-[10px] text-slate-400 italic">Enter any previous due amount if applicable</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/20 flex items-center justify-center gap-2"
            >
              <Save size={18} /> Save Customer
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const Plus = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
)
