import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tetris AI Playground',
  description: 'AI Prompt编程挑战平台 - 俄罗斯方块版',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-black text-white font-mono">{children}</body>
    </html>
  )
}