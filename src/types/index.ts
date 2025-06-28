// 全局类型定义

export interface Position {
  x: number
  y: number
}

export interface Piece {
  type: PieceType
  shape: boolean[][]
  color: string
  rotation: number
}

export enum PieceType {
  I = 'I',
  O = 'O', 
  T = 'T',
  S = 'S',
  Z = 'Z',
  J = 'J',
  L = 'L'
}

export enum CellState {
  EMPTY = 0,
  FILLED = 1
}

export enum GameState {
  WAITING = 'waiting',
  PROCESSING = 'processing',
  ANIMATING = 'animating',
  GAME_OVER = 'game_over'
}

export enum Direction {
  LEFT = 'left',
  RIGHT = 'right', 
  DOWN = 'down'
}

export interface GameRecord {
  id: string
  score: number
  startTime: Date
  duration: number
  prompt: string
  endReason: 'completed' | 'game_over'
  createdAt: Date
}

export interface GameConfig {
  soundEnabled: boolean
  animationSpeed: number
  theme: 'dark' | 'light'
}