'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Printer, Download, User, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const transactions = [
  { id: 'TXN-101', date: '2024-03-20', type: 'Invoice', ref: 'INV-2024-001', debit: 45000, credit: 0, balance: 45000 },
  { id: 'TXN-102', date: '2024-03-20', type: 'Payment', ref: 'PAY-501', debit: 0, credit: 45000, balance: 0 },
  { id: 'TXN-103', date: '2024-03-15', type: 'Invoice', ref: 'INV-2024-012', debit: 12000, credit: 0, balance: 12000 },
  { id: 'TXN-104', date: '2024-03-10', type: 'Return', ref: 'RET-001', debit: 0, credit: 2000, balance: 10000 },
]

export default function CustomerStatementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Customer Statement</h1>
            <p className="text-slate-500">Detailed financial history and ledger for individual customers.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700">
              <Printer size={18} /> Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700">
              <Download size={18} /> PDF
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-amber-600/20">
              AJ
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Alice Johnson</h2>
              <p className="text-slate-500 text-sm">Customer ID: CUS-001 • Premium Member</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                <span className="text-xs text-slate-400">Member since Jan 2023</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Billed</p>
              <p className="text-lg font-bold text-slate-900">৳156,000</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Paid</p>
              <p className="text-lg font-bold text-emerald-600">৳146,000</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Due</p>
              <p className="text-lg font-bold text-rose-500">৳10,000</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Ledger Details</h3>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-sm text-slate-600 font-medium">Jan 01, 2024 - Mar 31, 2024</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Reference</th>
                  <th className="px-6 py-4 font-semibold text-right">Debit (+)</th>
                  <th className="px-6 py-4 font-semibold text-right">Credit (-)</th>
                  <th className="px-6 py-4 font-semibold text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{txn.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {txn.debit > 0 ? <ArrowUpRight size={14} className="text-rose-400" /> : <ArrowDownLeft size={14} className="text-emerald-400" />}
                        <span className="text-sm font-medium text-slate-700">{txn.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-amber-600 font-medium">{txn.ref}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">{txn.debit > 0 ? `৳${txn.debit.toLocaleString()}` : '-'}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-emerald-600">{txn.credit > 0 ? `৳${txn.credit.toLocaleString()}` : '-'}</td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-slate-900">৳{txn.balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold text-slate-900">
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-right uppercase tracking-wider text-xs text-slate-500">Closing Balance</td>
                  <td className="px-6 py-4 text-right text-lg">৳10,000</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
