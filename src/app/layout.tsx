import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GossAIPMaster - Your Ultimate Gossip Companion',
  description: 'Stay in the loop with all the hottest topics, trending debates, and juiciest discussions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900`}>
        {children}
      </body>
    </html>
  )
}
