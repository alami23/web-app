'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { 
  LayoutDashboard, 
  Trees, 
  Armchair, 
  FileText, 
  Calculator, 
  Undo2, 
  Users, 
  UserCircle, 
  Receipt, 
  Tags, 
  UserCog, 
  History, 
  ArrowLeftRight, 
  MessageSquare, 
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Search,
  Bell,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'POS Wood', icon: Trees, href: '/pos-wood' },
  { name: 'POS Furniture', icon: Armchair, href: '/pos-furniture' },
  { name: 'Invoice', icon: FileText, href: '/invoice' },
  { name: 'Estimate', icon: Calculator, href: '/estimate' },
  { name: 'Invoice Return', icon: Undo2, href: '/invoice-return' },
  { name: 'Customer', icon: Users, href: '/customer' },
  { name: 'Customer Statement', icon: UserCircle, href: '/customer-statement' },
  { name: 'Bills', icon: Receipt, href: '/bills' },
  { name: 'Furniture Category', icon: Tags, href: '/furniture-category' },
  { name: 'Wood Category', icon: Trees, href: '/wood-category' },
  { name: 'Staff', icon: UserCog, href: '/staff' },
  { name: 'Staff Statement', icon: History, href: '/staff-statement' },
  { name: 'Transactions', icon: ArrowLeftRight, href: '/transactions' },
  { name: 'SMS', icon: MessageSquare, href: '/sms' },
  { name: 'Reports', icon: BarChart3, href: '/reports' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) setIsSidebarOpen(false)
      else setIsSidebarOpen(true)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarOpen ? (isMobile ? '280px' : '260px') : '0px',
          x: isMobile && !isSidebarOpen ? -280 : 0
        }}
        className={cn(
          "fixed lg:relative z-50 h-screen bg-white border-r border-slate-200 overflow-hidden flex flex-col shadow-xl lg:shadow-none",
          !isSidebarOpen && !isMobile && "lg:w-0 border-none"
        )}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-600/20">
            <Armchair size={24} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-800 whitespace-nowrap">
            FurniTrack
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-amber-50 text-amber-700 font-medium" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon size={20} className={cn(
                  "transition-colors",
                  isActive ? "text-amber-600" : "text-slate-400 group-hover:text-slate-600"
                )} />
                <span className="whitespace-nowrap">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-amber-600 rounded-r-full"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
              JD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">John Doe</p>
              <p className="text-xs text-slate-500 truncate">Admin Account</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        {/* Top Navbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-slate-400 w-64">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none text-sm text-slate-900 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <button className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-full transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <User size={18} />
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
