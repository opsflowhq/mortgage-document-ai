import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PHProvider, PostHogPageview } from './providers'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mortgage Document Data Extractor | OCR & AI DEMO | MortgageFlow',
  description: 'This tool was built to demonstrate the use of OCR & AI to extract structured data from mortgage documents. To learn how it works and get source code, please follow the link bellow.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='text-primary'>
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <PHProvider>
        <body className={inter.className}>{children}</body>
      </PHProvider>
    </html>
  )
}
