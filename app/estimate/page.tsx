'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Plus, Printer, FileText, Calendar, User, ArrowRight, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const estimates = [
  { id: 'EST-2024-001', customer: 'John Doe', date: '2024-03-20', validUntil: '2024-04-20', amount: 85000, status: 'Pending', items: 'Royal Bed Set' },
  { id: 'EST-2024-002', customer: 'Sarah Connor', date: '2024-03-19', validUntil: '2024-04-19', amount: 42000, status: 'Accepted', items: 'Office Furniture' },
  { id: 'EST-2024-003', customer: 'Mike Ross', date: '2024-03-18', validUntil: '2024-04-18', amount: 120000, status: 'Expired', items: 'Full House Package' },
]

export default function EstimatePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">Estimates & Quotations</h1>
            <p className="text-slate-500 dark:text-slate-400">Create and manage price quotes for custom furniture orders.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20">
            <Plus size={18} /> New Estimate
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Pending', 'Accepted', 'Expired'].map((status) => (
            <div key={status} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{status}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {estimates.filter(e => e.status === status).length}
              </h3>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search estimates..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-sm dark:text-slate-100"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Estimate ID</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {estimates.map((est) => (
                  <tr key={est.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{est.id}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">Valid: {est.validUntil}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{est.customer}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{est.items}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">৳{est.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                        est.status === 'Accepted' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                        est.status === 'Pending' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                        "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      )}>
                        {est.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button title="Convert to Invoice" className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg text-emerald-600 transition-colors">
                          <ArrowRight size={18} />
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                          <Printer size={18} />
                        </button>
                        <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg text-rose-400 transition-colors">
                          <Trash2 size={18} />
                        </button>
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
