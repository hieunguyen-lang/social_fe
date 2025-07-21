// app/layout.tsx hoặc app/root-layout.tsx (Next.js App Router)

import './styles/globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Social Crawler',
  description: 'Là hệ thống hỗ trợ quản lý, tổng hợp và tra cứu hóa đơn một cách nhanh chóng và chính xác.',
  icons: {
    icon: '/logo.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.ico" />
      </head>
      <body className={inter.className + ' bg-black'}>
      <Navbar />
        <div
          style={{
            transform: 'scale(1)',
            transformOrigin: 'top left',
            width: '100vw',
            minHeight: '110vh',
            overflowX: 'auto',
          }}
        >
          <AuthProvider>
            
            <div className="w-full mx-auto rounded-xl sm:rounded-2xl bg-black text-white">
              {children}
            </div>
            <Footer />
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}
