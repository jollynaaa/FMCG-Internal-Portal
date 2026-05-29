import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getAuthUser } from '@/lib/data'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FMCG Sales Portal',
  description: 'Internal Sales & Operations Dashboard',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthUser()

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#030303] text-white min-h-screen`}>
        <div className="flex">
          <Sidebar />
          <div className="flex flex-col flex-1 min-h-screen ml-64">
            <Header role={user?.role ?? 'viewer'} />
            <main className="flex-1 p-6 max-w-[1400px] w-full">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
