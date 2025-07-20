import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ReduxProvider } from "@/app/redux-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Todo Manager",
  description: "Kelola tugas Anda dengan efisien",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
