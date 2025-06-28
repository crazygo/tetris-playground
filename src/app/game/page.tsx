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

  // 更新游戏状态
  const updateGameState = useCallback(() => {
    setGameState(gameEngine.gameState)
    setCurrentBoard(gameEngine.currentBoard)
    setCurrentPieceData(gameEngine.currentPieceData)
    setNextPieces(gameEngine.nextPieces)
  }, [gameEngine])

  // 处理游戏开始
  const handleStart = useCallback(() => {
    gameEngine.start()
    updateGameState()
  }, [gameEngine, updateGameState])

  // 处理游戏重置
  const handleReset = useCallback(() => {
    gameEngine.reset()
    updateGameState()
    setLastAction('')
    setValidationResult(undefined)
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
      if (result.success) {
        setLastAction(result.action || '')
        updateGameState()
      } else {
        alert(`执行失败: ${result.error}`)
      }
    } catch (error) {
      console.error('Execute step failed:', error)
      alert('执行步骤时出错')
    } finally {
      setIsProcessing(false)
    }
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
          {/* 左侧：AI配置 */}
          <div className="lg:col-span-1">
            <PromptEditor
              value={prompt}
              onChange={setPrompt}
              onValidate={handleValidatePrompt}
              validationResult={validationResult}
              isValidating={isValidating}
              examplePrompts={examplePrompts}
              className="mb-6"
            />
            
            <ControlPanel
              gameState={gameState.gameState}
              onStepClick={handleStep}
              onResetClick={handleReset}
              onStartClick={handleStart}
              isProcessing={isProcessing}
              aiReady={gameEngine.aiReady}
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
              
              {lastAction && (
                <div className="text-sm text-gray-300">
                  上次动作: {lastAction}
                </div>
              )}
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