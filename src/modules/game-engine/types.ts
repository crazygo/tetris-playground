import { GameState, Position } from '@/types'
import { PieceInstance } from '../piece-system/types'
import { ClearLinesResult } from '../board-manager/types'

export interface GameEngineState {
  gameState: GameState
  score: number
  level: number
  linesCleared: number
  timeElapsed: number
  startTime?: Date
  isRunning: boolean
}

export interface GameStats {
  score: number
  level: number
  linesCleared: number
  timeElapsed: number
  piecesPlaced: number
}

export interface StepResult {
  success: boolean
  action?: string
  linesCleared?: ClearLinesResult
  newScore?: number
  gameOver?: boolean
  error?: string
}

export interface GameCallbacks {
  onGameOver?: (stats: GameStats) => void
  onScoreUpdate?: (score: number, level: number) => void
  onStateChange?: (state: GameState) => void
  onLinesCleared?: (result: ClearLinesResult) => void
}