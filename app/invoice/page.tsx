'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Filter, Download, Printer, Eye, MoreHorizontal, Calendar, User, Plus } from 'lucide-react'
import { cn, safeParse } from '@/lib/utils'
import InvoiceModal from '@/components/InvoiceModal'

const initialInvoices = [
  { id: 'INV-2024-001', customer: 'Alice Johnson', date: '2024-03-20', deliveryDate: '2024-03-25', amount: 45000, paid: 45000, due: 0, status: 'Paid', type: 'Furniture' },
  { id: 'INV-2024-002', customer: 'Bob Smith', date: '2024-03-19', deliveryDate: '2024-03-22', amount: 12500, paid: 5000, due: 7500, status: 'Partial', type: 'Wood' },
  { id: 'INV-2024-003', customer: 'Charlie Brown', date: '2024-03-18', deliveryDate: '2024-03-28', amount: 32000, paid: 0, due: 32000, status: 'Due', type: 'Furniture' },
  { id: 'INV-2024-004', customer: 'Diana Prince', date: '2024-03-17', deliveryDate: '2024-03-17', amount: 8500, paid: 8500, due: 0, status: 'Paid', type: 'Wood' },
  { id: 'INV-2024-005', customer: 'Edward Norton', date: '2024-03-16', deliveryDate: '2024-03-30', amount: 15000, paid: 10000, due: 5000, status: 'Partial', type: 'Furniture' },
]

export default function InvoicePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [invoices, setInvoices] = useState<any[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)

  useEffect(() => {
    const loadInvoices = () => {
      const saved = localStorage.getItem('invoices_list')
      setInvoices(safeParse(saved, initialInvoices))
    }
    loadInvoices()
    window.addEventListener('storage', loadInvoices)
    return () => window.removeEventListener('storage', loadInvoices)
  }, [])

  const filteredInvoices = invoices.filter(inv => 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.customer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">Invoice Management</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage and track all your furniture and wood sales invoices.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Download size={18} /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20">
              <Plus size={18} /> Create Invoice
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by invoice ID or customer name..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:text-slate-100 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Calendar size={16} /> Date Range
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Invoice Details</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Payment</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{inv.id}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                          <Calendar size={12} /> {inv.date}
                        </span>
                        <span className={cn(
                          "text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded w-fit uppercase",
                          inv.type === 'Furniture' ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                        )}>
                          {inv.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                          <User size={16} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{inv.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">৳{inv.amount.toLocaleString()}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">Total Bill</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          <span>PAID: ৳{inv.paid.toLocaleString()}</span>
                          <span className="text-rose-500 dark:text-rose-400">DUE: ৳{inv.due.toLocaleString()}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${(inv.paid / inv.amount) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold",
                        inv.status === 'Paid' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                        inv.status === 'Partial' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                        "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                      )}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedInvoice(inv)
                            setIsInvoiceModalOpen(true)
                          }}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedInvoice(inv)
                            setIsInvoiceModalOpen(true)
                          }}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          <Printer size={18} />
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <InvoiceModal 
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          invoice={selectedInvoice}
        />
      </div>
    </DashboardLayout>
  )
}
