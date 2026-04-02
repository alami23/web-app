'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Printer, Download, Calendar, User, History, Wallet, Award, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const salaryHistory = [
  { id: 'SAL-001', month: 'March 2024', amount: 25000, date: '2024-03-01', status: 'Paid', method: 'Bank Transfer' },
  { id: 'SAL-002', month: 'February 2024', amount: 25000, date: '2024-02-01', status: 'Paid', method: 'Cash' },
  { id: 'SAL-003', month: 'January 2024', amount: 25000, date: '2024-01-01', status: 'Paid', method: 'Bank Transfer' },
]

export default function StaffStatementPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Staff Statement</h1>
            <p className="text-slate-500">Salary history, incentives, and attendance summary.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700">
              <Printer size={18} /> Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700">
              <Download size={18} /> Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-600/20">
              RA
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Rahim Ahmed</h2>
              <p className="text-slate-500 text-sm">Staff ID: STF-001 • Carpenter • Workshop</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                <span className="text-xs text-slate-400">Joined: Jan 15, 2023</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Monthly Salary</p>
              <p className="text-lg font-bold text-slate-900">৳25,000</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Paid</p>
              <p className="text-lg font-bold text-emerald-600">৳350,000</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Advance</p>
              <p className="text-lg font-bold text-rose-500">৳2,000</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Attendance</p>
              <p className="text-lg font-bold text-indigo-600">98%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Wallet size={18} /> Salary History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Month</th>
                      <th className="px-6 py-4 font-semibold">Amount</th>
                      <th className="px-6 py-4 font-semibold">Date Paid</th>
                      <th className="px-6 py-4 font-semibold">Method</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {salaryHistory.map((sal) => (
                      <tr key={sal.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{sal.month}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">৳{sal.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{sal.date}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{sal.method}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">{sal.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Award size={18} /> Incentives & Bonus</h3>
              <div className="space-y-4">
                {[
                  { title: 'Best Carpenter of Month', date: 'Feb 2024', amount: '৳2,000' },
                  { title: 'Overtime Bonus', date: 'Jan 2024', amount: '৳1,500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div>
                      <p className="text-sm font-bold text-indigo-900">{item.title}</p>
                      <p className="text-xs text-indigo-600">{item.date}</p>
                    </div>
                    <span className="font-bold text-indigo-700">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={18} /> Work Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Completed Projects</span>
                  <span className="font-bold text-slate-900">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Pending Tasks</span>
                  <span className="font-bold text-slate-900">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Avg. Daily Hours</span>
                  <span className="font-bold text-slate-900">8.5h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
