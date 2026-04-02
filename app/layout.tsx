import { Inter, Space_Grotesk } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Furniture Inventory Management System',
  description: 'Premium Furniture Business Management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-slate-50 text-slate-900 antialiased" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var originalFetch = window.fetch;
            Object.defineProperty(window, 'fetch', {
              get: function() { return originalFetch; },
              set: function(v) { 
                console.warn('Attempt to overwrite window.fetch detected:', v);
                // We don't actually set it to avoid the TypeError if it's already a getter
              },
              configurable: true
            });
          })();
        ` }} />
        {children}
      </body>
    </html>
  )
}
