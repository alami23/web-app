'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Send, MessageSquare, Users, History, Search, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const smsHistory = [
  { id: 1, recipient: 'Alice Johnson', message: 'Your order #INV-2024-001 has been delivered. Thank you!', date: '2024-03-20 14:30', status: 'Delivered' },
  { id: 2, recipient: 'Bob Smith', message: 'Reminder: Your payment of ৳7,500 is due. Please pay soon.', date: '2024-03-19 10:15', status: 'Delivered' },
  { id: 3, recipient: 'Charlie Brown', message: 'New Stock Alert! Premium Segun Wood beds now available.', date: '2024-03-18 16:45', status: 'Failed' },
]

const templates = [
  { title: 'Order Confirmation', text: 'Dear [Name], your order [ID] has been confirmed. Thank you for choosing FurniTrack!' },
  { title: 'Delivery Update', text: 'Hi [Name], your furniture [ID] is out for delivery and will reach you by [Time].' },
  { title: 'Payment Reminder', text: 'Dear [Name], this is a friendly reminder for your outstanding due of [Amount].' },
  { title: 'Promotional', text: 'Special Offer! Get 15% off on all Dining Sets this weekend at FurniTrack.' },
]

export default function SMSPage() {
  const [message, setMessage] = useState('')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">SMS Communication</h1>
            <p className="text-slate-500 dark:text-slate-400">Send automated notifications and marketing messages to customers.</p>
          </div>
          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <Wallet size={18} /> Balance: ৳450.00
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send SMS Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2"><Send size={20} className="text-amber-600" /> Send New Message</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recipient Type</label>
                    <select className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm dark:text-slate-100">
                      <option>Single Customer</option>
                      <option>All Customers</option>
                      <option>Due Customers Only</option>
                      <option>Staff Members</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Customer</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search customer..." 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Message Content</label>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{message.length} / 160 characters</span>
                  </div>
                  <textarea 
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none text-sm focus:ring-2 focus:ring-amber-500/20 transition-all resize-none dark:text-slate-100"
                  />
                </div>
                <button className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2">
                  <Send size={18} /> Send Message Now
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2"><History size={20} className="text-slate-400" /> Recent History</h3>
                <button className="text-sm font-semibold text-amber-600 hover:underline">View All</button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {smsHistory.map((sms) => (
                  <div key={sms.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{sms.recipient}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1"><Clock size={10} /> {sms.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 mb-2">{sms.message}</p>
                    <div className="flex items-center gap-1.5">
                      {sms.status === 'Delivered' ? (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      ) : (
                        <AlertCircle size={12} className="text-rose-500" />
                      )}
                      <span className={cn(
                        "text-[10px] font-bold uppercase",
                        sms.status === 'Delivered' ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {sms.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Templates */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2"><MessageSquare size={20} className="text-slate-400" /> Quick Templates</h3>
              <div className="space-y-3">
                {templates.map((temp) => (
                  <button 
                    key={temp.title}
                    onClick={() => setMessage(temp.text)}
                    className="w-full text-left p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all group"
                  >
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-amber-400">{temp.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{temp.text}</p>
                  </button>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                + Create New Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function Wallet({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
}
