'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface InvoicePrintProps {
  invoice: any
  size: 'A4' | 'A5' | 'POS'
}

export default function InvoicePrint({ invoice, size }: InvoicePrintProps) {
  if (!invoice) return null

  const isPOS = size === 'POS'
  const isA5 = size === 'A5'

  return (
    <div className={cn(
      "bg-white text-black font-sans p-4 mx-auto",
      size === 'A4' && "w-[210mm] min-h-[297mm]",
      size === 'A5' && "w-[148mm] min-h-[210mm]",
      size === 'POS' && "w-[80mm] text-[10px]"
    )}>
      {/* Header */}
      <div className={cn("text-center mb-6", isPOS && "mb-2")}>
        <h1 className={cn("text-2xl font-bold uppercase tracking-wider", isPOS && "text-lg")}>Furniture Business</h1>
        <p className="text-xs">123 Business Street, City, Country</p>
        <p className="text-xs">Phone: +880 1234 567890</p>
        <div className={cn("mt-4 border-y py-2", isPOS && "mt-2 py-1")}>
          <h2 className={cn("text-xl font-bold uppercase", isPOS && "text-sm")}>Invoice</h2>
        </div>
      </div>

      {/* Info */}
      <div className={cn("grid grid-cols-2 gap-4 mb-6 text-sm", isPOS && "grid-cols-1 gap-1 mb-2 text-[10px]")}>
        <div>
          <p><span className="font-bold">Invoice ID:</span> {invoice.id}</p>
          <p><span className="font-bold">Date:</span> {invoice.date}</p>
          <p><span className="font-bold">Type:</span> {invoice.type}</p>
        </div>
        <div className={isPOS ? "text-left" : "text-right"}>
          <p className="font-bold">Customer Details:</p>
          <p>{invoice.customer}</p>
          {invoice.customerPhone && <p>{invoice.customerPhone}</p>}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-6 border-collapse">
        <thead>
          {invoice.type === 'Wood' ? (
            <tr className={cn("border-b-2 border-black text-left uppercase", isPOS ? "text-[9px]" : "text-xs")}>
              <th className="py-2 w-6">No</th>
              <th className="py-2 w-10">Car</th>
              <th className="py-2">(Tree-W-L) = Size</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          ) : (
            <tr className="border-b-2 border-black text-left text-xs">
              <th className="py-2">Item</th>
              <th className="py-2 text-center">Qty/Size</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          )}
        </thead>
        <tbody className="divide-y divide-slate-200">
          {invoice.items.map((item: any, idx: number) => (
            invoice.type === 'Wood' ? (
              <tr key={idx} className={cn(isPOS ? "text-[10px]" : "text-xs")}>
                <td className="py-2">{idx + 1}</td>
                <td className="py-2">{item.carNo || '-'}</td>
                <td className="py-2 font-medium">
                  ({item.treeNo || '-'}-{item.width || 0}&quot;-{item.length || 0}&apos;) = <span className="font-bold">{item.cft?.toFixed(2)}</span>
                </td>
                <td className="py-2 text-right">৳{item.price.toLocaleString()}</td>
                <td className="py-2 text-right font-bold">৳{item.total.toLocaleString()}</td>
              </tr>
            ) : (
              <tr key={idx} className="text-xs">
                <td className="py-2">
                  <p className="font-bold">{item.name}</p>
                  {item.description && <p className="text-[10px] text-slate-500 italic">{item.description}</p>}
                </td>
                <td className="py-2 text-center">
                  {item.quantity || item.cft?.toFixed(2) || 1} {item.unit || (item.cft ? 'CFT' : 'Pcs')}
                </td>
                <td className="py-2 text-right">৳{item.price.toLocaleString()}</td>
                <td className="py-2 text-right font-bold">৳{item.total.toLocaleString()}</td>
              </tr>
            )
          ))}
        </tbody>
      </table>

      {/* Calculations */}
      <div className={cn("flex justify-between items-end", isPOS && "flex-col items-end")}>
        <div className={cn("text-sm", isPOS && "w-full mb-4 border-b pb-2")}>
          {!isPOS && (
            <div className="w-64 space-y-1 border-t-2 border-slate-200 pt-2">
              <p className="font-bold text-slate-900 uppercase text-xs mb-2">Account Summary</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Previous Due:</span>
                  <span className="font-bold">৳{(invoice.oldDue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Current Due:</span>
                  <span className="font-bold text-amber-600">৳{invoice.due.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-1.5 mt-1.5">
                  <span>Total Due:</span>
                  <span className="text-rose-600">৳{((invoice.oldDue || 0) + invoice.due).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
          {isPOS && (invoice.oldDue > 0 || invoice.due > 0) && (
            <div className="space-y-0.5 border-t border-dashed pt-1 mt-1 text-[9px]">
              <div className="flex justify-between">
                <span>Previous Due:</span>
                <span>৳{(invoice.oldDue || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Due:</span>
                <span>৳{invoice.due.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-dotted mt-0.5 pt-0.5">
                <span>Total Due:</span>
                <span>৳{((invoice.oldDue || 0) + invoice.due).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        <div className={cn("w-64 space-y-2", isPOS && "w-full")}>
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>৳{invoice.amount.toLocaleString()}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span>Discount ({invoice.discountType === 'percent' ? `${invoice.discount}%` : 'Fixed'}):</span>
              <span>-৳{(invoice.discountType === 'percent' ? (invoice.amount * invoice.discount / 100) : invoice.discount).toLocaleString()}</span>
            </div>
          )}
          {invoice.deliveryCharge > 0 && (
            <div className="flex justify-between text-sm">
              <span>Delivery Charge:</span>
              <span>৳{invoice.deliveryCharge.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t-2 border-black pt-2">
            <span>Total:</span>
            <span>৳{invoice.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-emerald-600">
            <span>Paid Amount:</span>
            <span>৳{invoice.paid.toLocaleString()}</span>
          </div>
          {invoice.due > 0 && (
            <div className="flex justify-between text-sm font-bold text-rose-600">
              <span>Due Amount:</span>
              <span>৳{invoice.due.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={cn("mt-12 pt-8 border-t text-center text-xs text-slate-500", isPOS && "mt-4 pt-4")}>
        <p>Thank you for your business!</p>
        <p>Please keep this invoice for your records.</p>
        <div className="mt-8 flex justify-between px-12">
          <div className="border-t border-black w-32 pt-1">Customer Signature</div>
          <div className="border-t border-black w-32 pt-1">Authorized Signature</div>
        </div>
      </div>
    </div>
  )
}
