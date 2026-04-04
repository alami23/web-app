'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Plus, Receipt, Calendar, User, Tag, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const bills = [
  { id: 'BILL-001', vendor: 'Timber Supply Co.', category: 'Wood Purchase', amount: 85000, date: '2024-03-20', status: 'Paid', note: 'Mahogany & Teak stock' },
  { id: 'BILL-002', vendor: 'Hardware World', category: 'Accessories', amount: 12500, date: '2024-03-19', status: 'Pending', note: 'Hinges and handles' },
  { id: 'BILL-003', vendor: 'City Electric', category: 'Utility', amount: 4500, date: '2024-03-15', status: 'Paid', note: 'Workshop electricity' },
  { id: 'BILL-004', vendor: 'Workshop Rent', category: 'Rent', amount: 25000, date: '2024-03-01', status: 'Paid', note: 'March 2024 rent' },
]

export default function BillsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">Bills & Expenses</h1>
            <p className="text-slate-500 dark:text-slate-400">Track all your business purchases, utilities, and operational costs.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-amber-700 transition-all shadow-lg shadow-slate-900/20 dark:shadow-amber-600/20">
            <Plus size={18} /> Add New Bill
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Expenses', value: '৳125,000', color: 'bg-slate-900' },
            { label: 'Paid Bills', value: '৳112,500', color: 'bg-emerald-500' },
            { label: 'Pending Bills', value: '৳12,500', color: 'bg-amber-500' },
            { label: 'This Month', value: '৳45,000', color: 'bg-blue-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search bills by vendor or ID..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-sm dark:text-slate-100"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400">All Categories</button>
              <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400">This Month</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Bill Details</th>
                  <th className="px-6 py-4 font-semibold">Vendor</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{bill.id}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1"><Calendar size={12} /> {bill.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                          <User size={16} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{bill.vendor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full w-fit">
                        <Tag size={12} /> {bill.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">৳{bill.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                        bill.status === 'Paid' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      )}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><MoreHorizontal size={18} /></button>
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
