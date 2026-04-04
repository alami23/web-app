'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Package, 
  Users, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  CheckCircle2
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { cn } from '@/lib/utils'

const salesData = [
  { name: 'Mon', sales: 4000, profit: 2400 },
  { name: 'Tue', sales: 3000, profit: 1398 },
  { name: 'Wed', sales: 2000, profit: 9800 },
  { name: 'Thu', sales: 2780, profit: 3908 },
  { name: 'Fri', sales: 1890, profit: 4800 },
  { name: 'Sat', sales: 2390, profit: 3800 },
  { name: 'Sun', sales: 3490, profit: 4300 },
]

const stockData = [
  { name: 'Beds', stock: 45, min: 10 },
  { name: 'Sofas', stock: 32, min: 15 },
  { name: 'Chairs', stock: 120, min: 50 },
  { name: 'Tables', stock: 28, min: 20 },
  { name: 'Wardrobes', stock: 15, min: 5 },
]

const categorySales = [
  { name: 'Furniture', value: 75, color: '#f59e0b' },
  { name: 'Raw Wood', value: 25, color: '#10b981' },
]

const customerDueData = [
  { id: 1, name: 'Alice Johnson', phone: '01711-223344', email: 'alice@example.com', totalDue: 12500, lastInvoiceDate: '2024-03-15' },
  { id: 2, name: 'Bob Smith', phone: '01822-334455', email: 'bob@example.com', totalDue: 8400, lastInvoiceDate: '2024-03-10' },
  { id: 3, name: 'Charlie Brown', phone: '01933-445566', email: 'charlie@example.com', totalDue: 22000, lastInvoiceDate: '2024-03-20' },
  { id: 4, name: 'Diana Prince', phone: '01644-556677', email: 'diana@example.com', totalDue: 5600, lastInvoiceDate: '2024-03-05' },
  { id: 5, name: 'Edward Norton', phone: '01555-667788', email: 'edward@example.com', totalDue: 15000, lastInvoiceDate: '2024-03-18' },
]

export default function ReportPage() {
  const [reportType, setReportType] = useState('Sales')
  const [sortField, setSortField] = useState<'totalDue' | 'lastInvoiceDate'>('totalDue')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const sortedDueData = [...customerDueData].sort((a, b) => {
    if (sortField === 'totalDue') {
      return sortOrder === 'asc' ? a.totalDue - b.totalDue : b.totalDue - a.totalDue
    } else {
      return sortOrder === 'asc' 
        ? new Date(a.lastInvoiceDate).getTime() - new Date(b.lastInvoiceDate).getTime()
        : new Date(b.lastInvoiceDate).getTime() - new Date(a.lastInvoiceDate).getTime()
    }
  })

  const toggleSort = (field: 'totalDue' | 'lastInvoiceDate') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const handleSendReminder = (customerName: string) => {
    // Mock sending a reminder
    console.log(`Sending reminder to ${customerName}...`);
    alert(`Reminder sent to ${customerName} successfully!`);
  }

  const handleExport = (format: 'Excel' | 'PDF') => {
    alert(`Exporting ${reportType} Report as ${format}...`);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Business Reports</h1>
            <p className="text-slate-500">Analyze your furniture business performance with detailed insights.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Printer size={18} /> Print Report
            </button>
            <button 
              onClick={() => handleExport('Excel')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
            >
              <Download size={18} /> Export Excel
            </button>
            <button 
              onClick={() => handleExport('PDF')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-colors"
            >
              <Download size={18} /> Export PDF
            </button>
          </div>
        </div>

        {/* Report Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['Sales', 'Purchase', 'Stock', 'Customer Due', 'Expense', 'Profit/Loss'].map(type => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
                reportType === type 
                  ? "bg-slate-900 text-white shadow-lg" 
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
              )}
            >
              {type} Report
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Mar 01, 2024 - Mar 31, 2024</span>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select className="bg-transparent border-none outline-none text-sm font-medium text-slate-600">
                <option>All Branches</option>
                <option>Main Showroom</option>
                <option>Workshop A</option>
              </select>
            </div>
          </div>
          <button className="w-full md:w-auto px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold">Apply Filters</button>
        </div>

        {reportType === 'Customer Due' ? (
          <div className="space-y-6">
            {/* Customer Due Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Outstanding</p>
                <h3 className="text-2xl font-bold text-rose-600">৳{customerDueData.reduce((acc, curr) => acc + curr.totalDue, 0).toLocaleString()}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Due Customers</p>
                <h3 className="text-2xl font-bold text-slate-900">{customerDueData.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Avg. Due per Customer</p>
                <h3 className="text-2xl font-bold text-amber-600">৳{(customerDueData.reduce((acc, curr) => acc + curr.totalDue, 0) / customerDueData.length).toLocaleString()}</h3>
              </div>
            </div>

            {/* Customer Due Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Customer Due List</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Sorted by: <span className="font-bold text-slate-900 capitalize">{sortField.replace(/([A-Z])/g, ' $1')}</span></span>
                  <span className="uppercase font-bold text-slate-900">({sortOrder})</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Customer Name</th>
                      <th className="px-6 py-4 font-semibold">Contact Info</th>
                      <th 
                        className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors group"
                        onClick={() => toggleSort('totalDue')}
                      >
                        <div className="flex items-center gap-2">
                          Total Due
                          <TrendingUp size={14} className={cn("transition-transform", sortField === 'totalDue' && sortOrder === 'desc' ? "rotate-180" : "")} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors group"
                        onClick={() => toggleSort('lastInvoiceDate')}
                      >
                        <div className="flex items-center gap-2">
                          Last Invoice Date
                          <Calendar size={14} className={cn("transition-transform", sortField === 'lastInvoiceDate' && sortOrder === 'desc' ? "rotate-180" : "")} />
                        </div>
                      </th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedDueData.map((customer) => (
                      <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm font-bold text-slate-900">{customer.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">{customer.phone}</div>
                          <div className="text-xs text-slate-400">{customer.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-rose-600">৳{customer.totalDue.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{customer.lastInvoiceDate}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleSendReminder(customer.name)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors group relative"
                            title="Send Reminder"
                          >
                            <Send size={18} />
                            <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
                              Send Reminder
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sales Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900">৳{salesData.reduce((acc, curr) => acc + curr.sales, 0).toLocaleString()}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Profit</p>
                <h3 className="text-2xl font-bold text-emerald-600">৳{salesData.reduce((acc, curr) => acc + curr.profit, 0).toLocaleString()}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Avg. Daily Sales</p>
                <h3 className="text-2xl font-bold text-amber-600">৳{(salesData.reduce((acc, curr) => acc + curr.sales, 0) / salesData.length).toLocaleString()}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Conversion Rate</p>
                <h3 className="text-2xl font-bold text-slate-900">12.4%</h3>
              </div>
            </div>

            {/* Report Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-800 text-lg">{reportType} Performance Trend</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs text-slate-500 font-medium">Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-slate-500 font-medium">Profit</span>
                </div>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="sales" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={30} />
                  <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Revenue Breakdown</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySales}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {categorySales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 mt-6">
                {categorySales.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm font-medium text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Net Profit Margin</p>
                <h3 className="text-3xl font-bold mb-4">24.5%</h3>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <ArrowUpRight size={16} /> +4.2% from last month
                </div>
              </div>
              <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12" />
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Detailed Sales Summary</h3>
            <button className="text-sm font-bold text-amber-600">View Full Ledger</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Items Sold</th>
                  <th className="px-6 py-4 font-semibold">Revenue</th>
                  <th className="px-6 py-4 font-semibold">Cost</th>
                  <th className="px-6 py-4 font-semibold">Profit</th>
                  <th className="px-6 py-4 font-semibold">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { cat: 'Beds', items: 12, rev: 540000, cost: 380000, profit: 160000, growth: '+12%' },
                  { cat: 'Sofas', items: 8, rev: 256000, cost: 180000, profit: 76000, growth: '+5%' },
                  { cat: 'Dining Sets', items: 5, rev: 140000, cost: 95000, profit: 45000, growth: '-2%' },
                  { cat: 'Office Desks', items: 15, rev: 180000, cost: 120000, profit: 60000, growth: '+18%' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{row.cat}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{row.items} units</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">৳{row.rev.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">৳{row.cost.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">৳{row.profit.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-xs font-bold flex items-center gap-1",
                        row.growth.startsWith('+') ? "text-emerald-600" : "text-rose-500"
                      )}>
                        {row.growth.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {row.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
  </div>
</DashboardLayout>
  )
}
