'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Plus, UserPlus, Phone, MapPin, MoreVertical, Mail, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const customers = [
  { id: 'CUS-001', name: 'Alice Johnson', phone: '+880 1712-345678', address: 'Banani, Dhaka', type: 'Premium', totalOrders: 12, totalDue: 0, lastPurchase: '2024-03-20' },
  { id: 'CUS-002', name: 'Bob Smith', phone: '+880 1812-987654', address: 'Uttara, Dhaka', type: 'Regular', totalOrders: 5, totalDue: 7500, lastPurchase: '2024-03-19' },
  { id: 'CUS-003', name: 'Charlie Brown', phone: '+880 1912-112233', address: 'Dhanmondi, Dhaka', type: 'Wholesale', totalOrders: 28, totalDue: 32000, lastPurchase: '2024-03-18' },
  { id: 'CUS-004', name: 'Diana Prince', phone: '+880 1612-445566', address: 'Gulshan, Dhaka', type: 'Premium', totalOrders: 8, totalDue: 0, lastPurchase: '2024-03-17' },
]

export default function CustomerPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Customer Directory</h1>
            <p className="text-slate-500">Manage your customer relationships and order history.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20">
            <UserPlus size={18} /> Add New Customer
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Customers', value: '1,240', color: 'bg-blue-500' },
            { label: 'Active This Month', value: '156', color: 'bg-emerald-500' },
            { label: 'New Customers', value: '24', color: 'bg-purple-500' },
            { label: 'Total Due', value: '৳1.2M', color: 'bg-rose-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, phone or ID..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-600">Filter</button>
              <button className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-600">Export</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Orders</th>
                  <th className="px-6 py-4 font-semibold">Balance</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((cus) => (
                  <tr key={cus.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                          {cus.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{cus.name}</span>
                          <span className="text-xs text-slate-400">{cus.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-600 flex items-center gap-1"><Phone size={12} /> {cus.phone}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={12} /> {cus.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                        cus.type === 'Premium' ? "bg-purple-100 text-purple-700" :
                        cus.type === 'Wholesale' ? "bg-blue-100 text-blue-700" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {cus.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{cus.totalOrders} Orders</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-sm font-bold",
                        cus.totalDue > 0 ? "text-rose-500" : "text-emerald-600"
                      )}>
                        {cus.totalDue > 0 ? `৳${cus.totalDue.toLocaleString()}` : 'No Due'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><MessageSquare size={18} /></button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><MoreVertical size={18} /></button>
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
