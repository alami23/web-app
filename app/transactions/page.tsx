'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Calendar, Tag, CreditCard, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const transactions = [
  { id: 'TXN-001', date: '2024-03-20', type: 'Sale', ref: 'INV-2024-001', amount: 45000, method: 'Bank', status: 'Completed', entity: 'Alice Johnson' },
  { id: 'TXN-002', date: '2024-03-20', type: 'Expense', ref: 'BILL-001', amount: 85000, method: 'Cash', status: 'Completed', entity: 'Timber Supply Co.' },
  { id: 'TXN-003', date: '2024-03-19', type: 'Salary', ref: 'SAL-001', amount: 25000, method: 'Bank', status: 'Completed', entity: 'Rahim Ahmed' },
  { id: 'TXN-004', date: '2024-03-19', type: 'Sale', ref: 'INV-2024-002', amount: 5000, method: 'Mobile', status: 'Completed', entity: 'Bob Smith' },
  { id: 'TXN-005', date: '2024-03-18', type: 'Refund', ref: 'RET-001', amount: 2000, method: 'Cash', status: 'Completed', entity: 'Alice Johnson' },
]

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">Financial Transactions</h1>
            <p className="text-slate-500 dark:text-slate-400">Real-time log of all money moving in and out of your business.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300">Export CSV</button>
            <button className="px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20">Add Transaction</button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm dark:text-slate-100"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400"><Filter size={16} /> All Types</button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400"><Calendar size={16} /> This Week</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Transaction ID</th>
                  <th className="px-6 py-4 font-semibold">Type & Ref</th>
                  <th className="px-6 py-4 font-semibold">Entity</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Method</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{txn.id}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{txn.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {['Sale', 'Due Collection'].includes(txn.type) ? (
                          <ArrowDownLeft size={14} className="text-emerald-500 dark:text-emerald-400" />
                        ) : (
                          <ArrowUpRight size={14} className="text-rose-500 dark:text-rose-400" />
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{txn.type}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{txn.ref}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{txn.entity}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-sm font-bold",
                        ['Sale', 'Due Collection'].includes(txn.type) ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      )}>
                        {['Sale', 'Due Collection'].includes(txn.type) ? '+' : '-'}৳{txn.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <CreditCard size={14} /> {txn.method}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded uppercase">{txn.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 transition-colors"><MoreHorizontal size={18} /></button>
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
