'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { motion } from 'motion/react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts'
import { cn } from '@/lib/utils'

const stats = [
  { label: 'Total Sales', value: '৳124,500', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'bg-emerald-500' },
  { label: 'Total Purchases', value: '৳45,200', change: '-2.4%', trend: 'down', icon: ShoppingBag, color: 'bg-blue-500' },
  { label: 'Total Customers', value: '1,240', change: '+18.2%', trend: 'up', icon: Users, color: 'bg-amber-500' },
  { label: 'Due Collection', value: '৳12,800', change: '+4.1%', trend: 'up', icon: AlertCircle, color: 'bg-rose-500' },
]

const revenueData = [
  { month: 'Jan', revenue: 45000, profit: 12000 },
  { month: 'Feb', revenue: 52000, profit: 15000 },
  { month: 'Mar', revenue: 48000, profit: 11000 },
  { month: 'Apr', revenue: 61000, profit: 19000 },
  { month: 'May', revenue: 55000, profit: 16000 },
  { month: 'Jun', revenue: 67000, profit: 22000 },
]

const categoryData = [
  { name: 'Beds', value: 400, color: '#f59e0b' },
  { name: 'Sofas', value: 300, color: '#10b981' },
  { name: 'Dining', value: 300, color: '#3b82f6' },
  { name: 'Office', value: 200, color: '#8b5cf6' },
]

const recentInvoices = [
  { id: 'INV-001', customer: 'Alice Johnson', date: '2024-03-20', amount: '৳1,200', status: 'Paid' },
  { id: 'INV-002', customer: 'Bob Smith', date: '2024-03-19', amount: '৳850', status: 'Pending' },
  { id: 'INV-003', customer: 'Charlie Brown', date: '2024-03-18', amount: '৳2,400', status: 'Due' },
  { id: 'INV-004', customer: 'Diana Prince', date: '2024-03-17', amount: '৳1,100', status: 'Paid' },
]

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, here&apos;s what&apos;s happening with your furniture business today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between">
                <div className={stat.color + " p-3 rounded-xl text-white shadow-lg shadow-current/20"}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800">Monthly Revenue & Profit</h3>
              <select className="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-lg px-3 py-1.5 outline-none">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Sales by Category</h3>
            <div className="h-[250px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{item.value} units</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Recent Invoices</h3>
              <button className="text-amber-600 text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Invoice ID</th>
                    <th className="px-6 py-3 font-semibold">Customer</th>
                    <th className="px-6 py-3 font-semibold">Amount</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{inv.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{inv.customer}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">{inv.amount}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold",
                          inv.status === 'Paid' ? "bg-emerald-100 text-emerald-700" :
                          inv.status === 'Pending' ? "bg-amber-100 text-amber-700" :
                          "bg-rose-100 text-rose-700"
                        )}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stock Alerts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800">Low Stock Alerts</h3>
              <div className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-bold">4 Items</div>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Segun Wood (Raw)', stock: '12 cu ft', min: '50 cu ft', progress: 24 },
                { name: 'Office Chairs (Ergonomic)', stock: '3 units', min: '10 units', progress: 30 },
                { name: 'Mahogany Planks', stock: '8 cu ft', min: '40 cu ft', progress: 20 },
                { name: 'Dining Table (6 Seater)', stock: '1 unit', min: '5 units', progress: 20 },
              ].map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="text-slate-500">{item.stock} / {item.min}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      className="bg-rose-500 h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              Generate Purchase Orders <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
