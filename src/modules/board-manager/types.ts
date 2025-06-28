import { CellState, Position } from '@/types'
import { PieceInstance } from '../piece-system/types'

export interface Board {
  grid: CellState[][]
  width: number
  height: number
}

export interface ClearLinesResult {
  linesCleared: number
  points: number
  clearedRows: number[]
}

export interface PlacementResult {
  success: boolean
  position?: Position
  linesCleared?: ClearLinesResult
}