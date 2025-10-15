import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ihavenoenemy - AI-Powered Math Animations',
  description: 'Create stunning mathematical animations with AI. Powered by DeepSeek R1 and Manim.',
  keywords: 'math, animation, AI, education, Manim, DeepSeek, learning',
  authors: [{ name: 'ihavenoenemy' }],
  openGraph: {
    title: 'ihavenoenemy - AI-Powered Math Animations',
    description: 'Create stunning mathematical animations with AI',
    type: 'website',
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
