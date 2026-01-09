import { Inter } from 'next/font/google'
import "@/styles/index.css"
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <ToastContainer position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
