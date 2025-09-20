import type React from "react"
import type { Metadata } from "next"
// Local fallback for geist fonts to avoid requiring an external package during dev
const GeistSans = { variable: "font-sans" }
const GeistMono = { variable: "font-mono" }
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "MovieMind - AI Movie Recommendations",
  description: "Neural network-powered movie recommendations based on your reviews",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-mono ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
