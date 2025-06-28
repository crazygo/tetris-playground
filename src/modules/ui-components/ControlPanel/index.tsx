'use client'

import { GameState } from '@/types'

interface ControlPanelProps {
  gameState: GameState
  onStepClick: () => void
  onResetClick: () => void
  onStartClick: () => void
  isProcessing: boolean
  aiReady: boolean
  aiMode?: string
  aiStatus?: string
  className?: string
}

export function ControlPanel({ 
  gameState,
  onStepClick,
  onResetClick, 
  onStartClick,
  isProcessing,
  aiReady,
  aiMode = 'Unknown',
  aiStatus = 'Unknown',
  className = '' 
}: ControlPanelProps) {
  const getStepButtonText = () => {
    if (isProcessing) return 'AI思考中...'
    if (gameState === GameState.GAME_OVER) return '游戏结束'
    if (!aiReady) return 'AI未就绪'
    return 'One Step'
  }

  const canStep = gameState === GameState.WAITING && !isProcessing && aiReady
  const canStart = gameState === GameState.WAITING && !isProcessing

  return (
    <div className={`control-panel ${className}`}>
      <h3 className="text-lg font-bold mb-4 border-b border-white pb-2">
        游戏控制
      </h3>
      
      <div className="space-y-3">
        <button
          onClick={onStepClick}
          disabled={!canStep}
          className="btn w-full py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {getStepButtonText()}
        </button>
        
        <button
          onClick={onStartClick}
          disabled={!canStart}
          className="btn w-full py-2 text-center disabled:opacity-50"
        >
          {gameState === GameState.WAITING ? '开始游戏' : '重新开始'}
        </button>
        
        <button
          onClick={onResetClick}
          className="btn w-full py-2 text-center border-gray-500 text-gray-300"
        >
          重置游戏
        </button>
      </div>
      
      <div className="mt-4 text-xs text-gray-400 space-y-1">
        <div>游戏状态: {gameState}</div>
        <div>AI模式: {aiMode}</div>
        <div>AI状态: {aiReady ? '就绪' : '未就绪'}</div>
        <div title={aiStatus} className="truncate">
          {aiStatus.length > 20 ? `${aiStatus.substring(0, 20)}...` : aiStatus}
        </div>
      </div>
    </div>
  )
}