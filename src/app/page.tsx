import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto text-center">
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Tetris AI Playground</h1>
          <p className="text-xl mb-2">AI Prompt编程挑战平台</p>
          <p className="text-sm text-gray-400">
            通过编写提示词来"编程"AI代理，在俄罗斯方块场景中练习AI交互技能
          </p>
        </header>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="border border-white p-6">
            <h2 className="text-2xl font-bold mb-4">🎯 核心理念</h2>
            <ul className="text-left space-y-2 text-sm">
              <li>• 零代码门槛，只需编写提示词</li>
              <li>• 实时反馈，立即看到策略效果</li>
              <li>• 游戏化学习AI交互技巧</li>
              <li>• 开放透明的决策过程</li>
            </ul>
          </div>
          
          <div className="border border-white p-6">
            <h2 className="text-2xl font-bold mb-4">🚀 功能特色</h2>
            <ul className="text-left space-y-2 text-sm">
              <li>• 黑白高对比度设计</li>
              <li>• MVP单步执行模式</li>
              <li>• AI策略验证系统</li>
              <li>• 本地游戏记录存储</li>
            </ul>
          </div>
        </div>
        
        <div className="space-y-6">
          <Link 
            href="/game"
            className="btn inline-block px-8 py-4 text-xl hover:bg-white hover:text-black transition-colors"
          >
            开始挑战 →
          </Link>
          
          <div className="text-xs text-gray-500">
            <p>当前版本: MVP v0.1</p>
            <p>模块化架构，支持功能定义与代码同步</p>
          </div>
        </div>
      </div>
    </main>
  )
}