'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Printer, FileText, Layout, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import InvoicePrint from './InvoicePrint'

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: any
}

export default function InvoiceModal({ isOpen, onClose, invoice }: InvoiceModalProps) {
  const [selectedSize, setSelectedSize] = useState<'A4' | 'A5' | 'POS'>('A4')

  const handlePrint = () => {
    const content = document.getElementById('printable-invoice');
    if (!content) return;

    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    // Copy styles from the main document
    let styles = '';
    try {
      const styleSheets = Array.from(document.styleSheets);
      styleSheets.forEach(sheet => {
        try {
          const rules = Array.from(sheet.cssRules);
          rules.forEach(rule => {
            styles += rule.cssText;
          });
        } catch (e) {
          // Skip cross-origin stylesheets
        }
      });
    } catch (e) {
      console.error('Error copying styles:', e);
    }

    doc.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <style>
            ${styles}
            body { 
              background: white !important; 
              margin: 0 !important; 
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #printable-invoice { 
              box-shadow: none !important; 
              margin: 0 !important; 
              border: none !important;
              width: 100% !important;
              max-width: none !important;
            }
            @page {
              size: ${selectedSize === 'POS' ? '80mm auto' : selectedSize};
              margin: ${selectedSize === 'POS' ? '0' : '10mm'};
            }
            @media print {
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div id="printable-invoice">
            ${content.innerHTML}
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                setTimeout(() => {
                  window.frameElement.remove();
                }, 100);
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
  }

  if (!invoice) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Invoice Preview</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Select format and print your invoice</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Controls */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => setSelectedSize('A4')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                    selectedSize === 'A4' ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <FileText size={18} /> A4 Size
                </button>
                <button 
                  onClick={() => setSelectedSize('A5')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                    selectedSize === 'A5' ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <Layout size={18} /> A5 Size
                </button>
                <button 
                  onClick={() => setSelectedSize('POS')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                    selectedSize === 'POS' ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <Smartphone size={18} /> POS Size
                </button>
              </div>

              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-white transition-all shadow-lg shadow-slate-900/20"
              >
                <Printer size={18} /> Print Invoice
              </button>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-auto p-8 bg-slate-100 dark:bg-slate-950 flex justify-center">
              <div id="printable-invoice" className="shadow-2xl h-fit">
                <InvoicePrint invoice={invoice} size={selectedSize} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
