'use client'

import React, { useState } from 'react'
import { X, Camera, Upload } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

interface AddCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (name: string) => void
}

export default function AddCustomerModal({ isOpen, onClose, onSuccess }: AddCustomerModalProps) {
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

  const handleSave = async () => {
    if (newCustomer.name.trim() && newCustomer.phone.trim()) {
      const displayName = newCustomer.name.trim()
      try {
        await addDoc(collection(db, 'customers'), {
          ...newCustomer,
          name: displayName,
          type: 'Regular',
          totalOrders: 0,
          totalDue: 0,
          lastPurchase: new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp()
        });
        if (onSuccess) onSuccess(displayName)
        resetNewCustomer()
        onClose()
      } catch (error) {
        console.error("Error adding customer: ", error);
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Add New Customer</h3>
              <button onClick={() => { onClose(); resetNewCustomer(); }} className="text-slate-400 hover:text-slate-600">
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
                  onClick={() => { onClose(); resetNewCustomer(); }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={!newCustomer.name.trim() || !newCustomer.phone.trim()}
                  onClick={handleSave}
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
  )
}
