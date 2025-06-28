'use client'

import { useState, useEffect, useCallback } from 'react'
import { GameEngine } from '@/modules/game-engine'
import { GameState } from '@/types'
import {
  GameBoard,
  NextPieces,
  ScoreDisplay,
  ControlPanel,
  PromptEditor
} from '@/modules/ui-components'

export default function GamePage() {
  const [gameEngine] = useState(() => new GameEngine())
  const [gameState, setGameState] = useState(gameEngine.gameState)
  const [currentBoard, setCurrentBoard] = useState(gameEngine.currentBoard)
  const [currentPieceData, setCurrentPieceData] = useState(gameEngine.currentPieceData)
  const [nextPieces, setNextPieces] = useState(gameEngine.nextPieces)
  const [isProcessing, setIsProcessing] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [validationResult, setValidationResult] = useState<{isValid: boolean; errors: string[]} | undefined>()
  const [isValidating, setIsValidating] = useState(false)
  const [lastAction, setLastAction] = useState<string>('')
  const [actionLog, setActionLog] = useState<string[]>([])

  // 更新游戏状态
  const updateGameState = useCallback(() => {
    setGameState(gameEngine.gameState)
    setCurrentBoard(gameEngine.currentBoard)
    setCurrentPieceData(gameEngine.currentPieceData)
    setNextPieces(gameEngine.nextPieces)
  }, [gameEngine])

  // 页面加载时自动开始游戏
  useEffect(() => {
    gameEngine.start()
    updateGameState()
  }, [gameEngine, updateGameState])

  // 处理游戏开始
  const handleStart = useCallback(() => {
    gameEngine.start()
    updateGameState()
  }, [gameEngine, updateGameState])

  // 处理游戏重置 - 重新开始新局面但保留AI策略设置
  const handleReset = useCallback(() => {
    gameEngine.start() // 直接开始新游戏而不是reset，这样保留AI配置
    updateGameState()
    setLastAction('')
    setActionLog([]) // 清空行动日志
    // 不清除 prompt 和 validationResult，保留策略设置
  }, [gameEngine, updateGameState])

  // 处理单步执行
  const handleStep = useCallback(async () => {
    if (!gameEngine.aiReady) {
      alert('请先配置并验证AI策略')
      return
    }

    setIsProcessing(true)
    try {
      const result = await gameEngine.executeStep()
      const actionText = result.action || (result.success ? '动作执行完成' : `执行失败: ${result.error}`)
      setLastAction(actionText)
      
      // 添加到行动日志
      const logEntry = `${new Date().toLocaleTimeString()}: ${actionText}${result.linesCleared ? ` (消除${result.linesCleared.linesCleared}行)` : ''}`
      setActionLog(prev => [...prev, logEntry].slice(-10)) // 只保留最近10条记录
      
      updateGameState()
      
      // 只有在严重错误时才显示alert（比如游戏状态异常）
      if (!result.success && result.error?.includes('游戏未在等待状态')) {
        alert(`游戏状态异常: ${result.error}`)
      }
    } catch (error) {
      console.error('Execute step failed:', error)
      const errorMsg = '执行步骤时出错'
      
      // 只记录日志，不弹出alert
      setActionLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${errorMsg}`].slice(-10))
      setLastAction(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }, [gameEngine, updateGameState])

  // 处理5步执行
  const handleMultiStep = useCallback(async () => {
    if (!gameEngine.aiReady) {
      alert('请先配置并验证AI策略')
      return
    }

    setIsProcessing(true)
    const logEntry = `${new Date().toLocaleTimeString()}: 开始执行5步连续操作`
    setActionLog(prev => [...prev, logEntry].slice(-10))
    
    for (let i = 0; i < 5; i++) {
      try {
        const result = await gameEngine.executeStep()
        const actionText = result.action || (result.success ? '动作执行完成' : `执行失败: ${result.error}`)
        
        const stepLogEntry = `${new Date().toLocaleTimeString()}: 第${i+1}步: ${actionText}${result.linesCleared ? ` (消除${result.linesCleared.linesCleared}行)` : ''}`
        setActionLog(prev => [...prev, stepLogEntry].slice(-10))
        
        updateGameState()
        
        // 如果游戏结束，停止执行
        if (result.gameOver) {
          const endLogEntry = `${new Date().toLocaleTimeString()}: 游戏结束，停止执行`
          setActionLog(prev => [...prev, endLogEntry].slice(-10))
          break
        }
        
        // 短暂延迟让用户看到每步效果
        await new Promise(resolve => setTimeout(resolve, 200))
      } catch (error) {
        const errorMsg = `第${i+1}步执行出错`
        setActionLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${errorMsg}`].slice(-10))
        break
      }
    }
    
    setIsProcessing(false)
  }, [gameEngine, updateGameState])

  // 处理Prompt验证
  const handleValidatePrompt = useCallback(async () => {
    if (!prompt.trim()) {
      setValidationResult({
        isValid: false,
        errors: ['请输入策略描述']
      })
      return { isValid: false, errors: ['请输入策略描述'] }
    }

    setIsValidating(true)
    try {
      gameEngine.setAIPrompt(prompt)
      const result = await gameEngine.validateAIPrompt()
      setValidationResult(result)
      
      // 添加验证结果到日志
      if (result.isValid) {
        const logEntry = `${new Date().toLocaleTimeString()}: ✓ 策略验证成功`
        setActionLog(prev => [...prev, logEntry].slice(-10))
      }
      
      return result
    } catch (error) {
      const errorResult = {
        isValid: false,
        errors: ['验证过程出错']
      }
      setValidationResult(errorResult)
      return errorResult
    } finally {
      setIsValidating(false)
    }
  }, [prompt, gameEngine])

  // 获取示例Prompt
  const examplePrompts = [
    '尽量将方块放置在棋盘中央，避免堆积过高。优先清除完整行以获得分数。',
    '使用贪心策略，每次都寻找能立即清除行的位置。如果没有，则选择最低的可用位置。',
    '保持棋盘平整，避免产生空洞。优先填充棋盘底部的空隙。',
    '激进策略：尽快下落方块，不过多考虑优化位置，追求快速游戏节奏。'
  ]

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Tetris AI Playground</h1>
          <p className="text-sm text-gray-300">AI Prompt编程挑战平台</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：游戏控制 + AI配置 */}
          <div className="lg:col-span-1">
            {/* 游戏控制区域 */}
            <div className="mb-6 p-4 border border-white">
              <h3 className="text-lg font-bold mb-4 border-b border-white pb-2">
                游戏控制
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleReset}
                  className="btn w-full py-2 text-sm"
                >
                  重置游戏
                </button>
                
                <div className="text-xs text-gray-400 space-y-1">
                  <div>AI状态: {gameEngine.aiReady ? '就绪' : '未配置'}</div>
                  <div>游戏状态: {gameState.gameState}</div>
                </div>
              </div>
            </div>
            
            {/* AI策略配置 */}
            <PromptEditor
              value={prompt}
              onChange={setPrompt}
              onValidate={handleValidatePrompt}
              validationResult={validationResult}
              isValidating={isValidating}
              examplePrompts={examplePrompts}
              onStep={handleStep}
              onMultiStep={handleMultiStep}
              isProcessing={isProcessing}
              aiReady={gameEngine.aiReady}
              actionLog={actionLog}
            />
          </div>

          {/* 中间：游戏区域 */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="text-center">
              <GameBoard
                grid={currentBoard}
                currentPiece={currentPieceData?.piece}
                currentPosition={currentPieceData?.position}
                className="mb-4"
              />
              
            </div>
          </div>

          {/* 右侧：信息面板 */}
          <div className="lg:col-span-1">
            <ScoreDisplay
              score={gameState.score}
              level={gameState.level}
              linesCleared={gameState.linesCleared}
              timeElapsed={gameState.timeElapsed}
              className="mb-6"
            />
            
            <NextPieces
              pieces={nextPieces}
            />
          </div>
        </div>

        {/* 底部说明 */}
        <footer className="mt-8 text-center text-xs text-gray-500">
          <p>MVP版本 - 单步执行模式</p>
          <p>配置AI策略，点击"One Step"观察AI决策过程</p>
        </footer>
      </div>
    </div>
  )
}