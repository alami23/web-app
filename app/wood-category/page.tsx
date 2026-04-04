'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Plus, Trees, Edit2, Trash2, Box } from 'lucide-react'
import { cn } from '@/lib/utils'

const categories = [
  { id: 1, name: 'Hardwood', type: 'Raw Material', unit: 'cu ft', itemCount: 12, status: 'Active' },
  { id: 2, name: 'Softwood', type: 'Raw Material', unit: 'cu ft', itemCount: 8, status: 'Active' },
  { id: 3, name: 'Plywood', type: 'Board', unit: 'sq ft', itemCount: 24, status: 'Active' },
  { id: 4, name: 'MDF', type: 'Board', unit: 'sq ft', itemCount: 15, status: 'Active' },
  { id: 5, name: 'Hardware', type: 'Accessory', unit: 'pcs', itemCount: 156, status: 'Active' },
  { id: 6, name: 'Finishing', type: 'Chemical', unit: 'ltr', itemCount: 42, status: 'Active' },
]

export default function WoodCategoryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">Wood & Material Categories</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage raw materials, boards, and hardware categories.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-amber-700 transition-all shadow-lg shadow-slate-900/20 dark:shadow-amber-600/20">
            <Plus size={18} /> Add Category
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Category Name</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Unit</th>
                  <th className="px-6 py-4 font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          <Trees size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{cat.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium">{cat.unit}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">{cat.itemCount}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded uppercase">{cat.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><Edit2 size={16} /></button>
                        <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
