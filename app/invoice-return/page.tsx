'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Undo2, Calendar, User, FileText, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const returns = [
  { id: 'RET-001', invRef: 'INV-2024-012', customer: 'Alice Johnson', date: '2024-03-20', amount: 12000, reason: 'Damaged during delivery', status: 'Approved' },
  { id: 'RET-002', invRef: 'INV-2024-045', customer: 'Bob Smith', date: '2024-03-18', amount: 5000, reason: 'Wrong wood type', status: 'Pending' },
]

export default function InvoiceReturnPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">Invoice Returns</h1>
            <p className="text-slate-500 dark:text-slate-400">Handle product returns and refund adjustments.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20">
            <Undo2 size={18} /> Process Return
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by Return ID or Invoice..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-sm dark:text-slate-100"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Return ID</th>
                  <th className="px-6 py-4 font-semibold">Invoice Ref</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Reason</th>
                  <th className="px-6 py-4 font-semibold">Refund</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {returns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">{ret.id}</td>
                    <td className="px-6 py-4 text-sm text-amber-600 dark:text-amber-400 font-medium">{ret.invRef}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{ret.customer}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <AlertCircle size={14} className="text-rose-400" />
                        {ret.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">৳{ret.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                        ret.status === 'Approved' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      )}>
                        {ret.status}
                      </span>
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
