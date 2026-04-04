'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Search, Plus, UserCog, Phone, Calendar, MoreVertical, Shield, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'

const staff = [
  { id: 'STF-001', name: 'Rahim Ahmed', role: 'Carpenter', phone: '+880 1711-111111', joinDate: '2023-01-15', salary: 25000, status: 'Active', dept: 'Workshop' },
  { id: 'STF-002', name: 'Karim Ullah', role: 'Salesman', phone: '+880 1711-222222', joinDate: '2023-05-10', salary: 18000, status: 'Active', dept: 'Showroom' },
  { id: 'STF-003', name: 'Selim Reza', role: 'Manager', phone: '+880 1711-333333', joinDate: '2022-11-01', salary: 45000, status: 'Active', dept: 'Admin' },
  { id: 'STF-004', name: 'Abul Kashem', role: 'Delivery Staff', phone: '+880 1711-444444', joinDate: '2023-08-20', salary: 15000, status: 'Active', dept: 'Logistics' },
]

export default function StaffPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100">Staff Management</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your employees, roles, and performance.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            <Plus size={18} /> Add Staff
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Staff', value: '24', color: 'bg-indigo-500' },
            { label: 'Present Today', value: '22', color: 'bg-emerald-500' },
            { label: 'On Leave', value: '2', color: 'bg-amber-500' },
            { label: 'Monthly Payroll', value: '৳4.2L', color: 'bg-rose-500' },
          ].map((stat) => (
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
                placeholder="Search staff by name or role..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-sm dark:text-slate-100"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400">All Departments</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Staff Member</th>
                  <th className="px-6 py-4 font-semibold">Role & Dept</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Salary</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {staff.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold">
                          {s.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{s.name}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">{s.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1"><Briefcase size={12} /> {s.role}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">{s.dept}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1"><Phone size={12} /> {s.phone}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> Joined: {s.joinDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">৳{s.salary.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded uppercase">{s.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 transition-colors"><MoreVertical size={18} /></button>
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
