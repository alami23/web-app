'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Plus, Tags, Edit2, Trash2, Armchair } from 'lucide-react'
import { cn } from '@/lib/utils'

const categories = [
  { id: 1, name: 'Bed', description: 'King, Queen, and Single size beds', itemCount: 45, status: 'Active' },
  { id: 2, name: 'Sofa', description: 'Living room sofas and couch sets', itemCount: 32, status: 'Active' },
  { id: 3, name: 'Dining Table', description: 'Wooden and glass dining sets', itemCount: 28, status: 'Active' },
  { id: 4, name: 'Office Chair', description: 'Ergonomic and executive chairs', itemCount: 120, status: 'Active' },
  { id: 5, name: 'Wardrobe', description: 'Bedroom storage and cabinets', itemCount: 15, status: 'Active' },
  { id: 6, name: 'Dressing Table', description: 'Modern and classic dressing units', itemCount: 10, status: 'Active' },
]

export default function FurnitureCategoryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Furniture Categories</h1>
            <p className="text-slate-500">Organize your finished furniture products into logical groups.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20">
            <Plus size={18} /> Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Armchair size={24} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"><Edit2 size={16} /></button>
                  <button className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{cat.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{cat.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cat.itemCount} Items</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">{cat.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
