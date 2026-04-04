'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Plus, UserPlus, Phone, MapPin, MoreVertical, Mail, MessageSquare, FileText } from 'lucide-react'
import { cn, safeParse } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

import AddCustomerModal from '@/components/AddCustomerModal'

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

const initialCustomers: Customer[] = [
  { id: 'CUS-001', name: 'Alice Johnson', phone: '01711223344', address: 'Dhanmondi, Dhaka', type: 'Regular', totalOrders: 5, totalDue: 1200, lastPurchase: '2024-03-20' },
  { id: 'CUS-002', name: 'Bob Smith', phone: '01822334455', address: 'Gulshan, Dhaka', type: 'Premium', totalOrders: 12, totalDue: 0, lastPurchase: '2024-03-25' },
  { id: 'CUS-003', name: 'Charlie Brown', phone: '01933445566', address: 'Uttara, Dhaka', type: 'Wholesale', totalOrders: 25, totalDue: 15000, lastPurchase: '2024-03-28' },
]

export default function CustomerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customersList, setCustomersList] = useState<Customer[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCustomers = localStorage.getItem('customers_list')
      const customers = safeParse(savedCustomers, initialCustomers)
      
      const savedInvoices = localStorage.getItem('invoices_list')
      const invoices = safeParse(savedInvoices, [] as any[])

      // Update customer stats from real invoices
      return customers.map((cus: Customer) => {
        const customerInvoices = invoices.filter((inv: any) => inv.customer === cus.name)
        return {
          ...cus,
          totalOrders: customerInvoices.length,
          totalDue: customerInvoices.reduce((sum: number, inv: any) => sum + (inv.due || 0), 0),
          lastPurchase: customerInvoices.length > 0 
            ? customerInvoices.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date 
            : cus.lastPurchase
        }
      })
    }
    return initialCustomers
  })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    localStorage.setItem('customers_list', JSON.stringify(customersList))
  }, [customersList])

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomersList(prev => [...prev, newCustomer])
  }

  const filteredCustomers = customersList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = [
    { label: 'Total Customers', value: customersList.length.toLocaleString(), color: 'bg-blue-500' },
    { label: 'Active This Month', value: customersList.filter(c => c.totalOrders > 0).length.toString(), color: 'bg-emerald-500' },
    { label: 'New Customers', value: customersList.length > 0 ? 'Recently Added' : '0', color: 'bg-purple-500' },
    { label: 'Total Due', value: `৳${customersList.reduce((acc, c) => acc + (c.totalDue || 0), 0).toLocaleString()}`, color: 'bg-rose-500' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">Customer Directory</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your customer relationships and order history.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20"
          >
            <UserPlus size={18} /> Add New Customer
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
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
                placeholder="Search by name, phone or ID..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-sm dark:text-slate-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400">Filter</button>
              <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400">Export</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Orders</th>
                  <th className="px-6 py-4 font-semibold">Balance</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCustomers.map((cus) => (
                  <tr key={cus.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {cus.photo ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden relative">
                            <Image src={cus.photo} alt={cus.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold">
                            {cus.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{cus.name}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{cus.id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1"><Phone size={12} /> {cus.phone}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 line-clamp-1"><MapPin size={12} /> {cus.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                        cus.type === 'Premium' ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" :
                        cus.type === 'Wholesale' ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" :
                        "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      )}>
                        {cus.type || 'Regular'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{cus.totalOrders || 0} Orders</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-sm font-bold",
                        (cus.totalDue || 0) > 0 ? "text-rose-500 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                      )}>
                        {(cus.totalDue || 0) > 0 ? `৳${cus.totalDue.toLocaleString()}` : 'No Due'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/customer-statement?id=${cus.id}`}
                          className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg text-slate-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                          title="View Statement"
                        >
                          <FileText size={18} />
                        </Link>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 transition-colors"><MessageSquare size={18} /></button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 transition-colors"><MoreVertical size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                      No customers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddCustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddCustomer}
      />
    </DashboardLayout>
  )
}
