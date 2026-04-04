'use client'

import React, { useState, useEffect, Suspense } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Printer, Download, User, Calendar, ArrowUpRight, ArrowDownLeft, ChevronLeft } from 'lucide-react'
import { cn, safeParse } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Customer {
  id: string
  name: string
  phone: string
  address: string
  type: string
  totalOrders: number
  totalDue: number
  lastPurchase: string
  email?: string
  photo?: string | null
}

const transactions = [
  { id: 'TXN-101', date: '2024-03-20', type: 'Invoice', ref: 'INV-2024-001', debit: 45000, credit: 0, balance: 45000 },
  { id: 'TXN-102', date: '2024-03-20', type: 'Payment', ref: 'PAY-501', debit: 0, credit: 45000, balance: 0 },
  { id: 'TXN-103', date: '2024-03-15', type: 'Invoice', ref: 'INV-2024-012', debit: 12000, credit: 0, balance: 12000 },
  { id: 'TXN-104', date: '2024-03-10', type: 'Return', ref: 'RET-001', debit: 0, credit: 2000, balance: 10000 },
]

function CustomerStatementContent() {
  const searchParams = useSearchParams()
  const customerId = searchParams.get('id')
  const [customer, setCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    if (customerId) {
      const saved = localStorage.getItem('customers_list')
      const list = safeParse(saved, [] as Customer[])
      const found = list.find(c => c.id === customerId)
      if (found) {
        setCustomer(found)
      }
    }
  }, [customerId])

  if (!customer && customerId) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
          <User size={48} className="mb-4 opacity-20" />
          <p className="text-lg font-medium">Customer not found</p>
          <Link href="/customer" className="mt-4 text-amber-600 hover:underline flex items-center gap-1">
            <ChevronLeft size={16} /> Back to Directory
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  // Fallback for demo if no ID provided
  const displayCustomer = customer || {
    id: 'CUS-001',
    name: 'Alice Johnson',
    type: 'Premium',
    totalDue: 10000
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/customer" className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">Customer Statement</h1>
              <p className="text-slate-500 dark:text-slate-400">Detailed financial history and ledger for individual customers.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Printer size={18} /> Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Download size={18} /> PDF
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-amber-600/20">
              {displayCustomer.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{displayCustomer.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Customer ID: {displayCustomer.id} • {displayCustomer.type} Member</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Member since Jan 2023</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8">
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Total Billed</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">৳{(displayCustomer.totalDue + 146000).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Total Paid</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">৳146,000</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Current Due</p>
              <p className="text-lg font-bold text-rose-500 dark:text-rose-400">৳{displayCustomer.totalDue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Ledger Details</h3>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Jan 01, 2024 - Mar 31, 2024</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Reference</th>
                  <th className="px-6 py-4 font-semibold text-right">Debit (+)</th>
                  <th className="px-6 py-4 font-semibold text-right">Credit (-)</th>
                  <th className="px-6 py-4 font-semibold text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{txn.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {txn.debit > 0 ? <ArrowUpRight size={14} className="text-rose-400" /> : <ArrowDownLeft size={14} className="text-emerald-400" />}
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{txn.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-amber-600 dark:text-amber-400 font-medium">{txn.ref}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-slate-900 dark:text-slate-100">{txn.debit > 0 ? `৳${txn.debit.toLocaleString()}` : '-'}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-emerald-600 dark:text-emerald-400">{txn.credit > 0 ? `৳${txn.credit.toLocaleString()}` : '-'}</td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-slate-900 dark:text-slate-100">৳{txn.balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-800/50 font-bold text-slate-900 dark:text-slate-100">
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-right uppercase tracking-wider text-xs text-slate-500 dark:text-slate-400">Closing Balance</td>
                  <td className="px-6 py-4 text-right text-lg">৳{displayCustomer.totalDue.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function CustomerStatementPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </DashboardLayout>
    }>
      <CustomerStatementContent />
    </Suspense>
  )
}
