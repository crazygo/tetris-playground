import { CellState, Position } from '@/types'
import { PieceInstance } from '../piece-system/types'
import { Board, ClearLinesResult, PlacementResult } from './types'
import { CollisionDetector } from './collision'
import { LineClearProcessor } from './line-clear'

export class BoardManager {
  private board: Board
  private collisionDetector: CollisionDetector
  private lineClearProcessor: LineClearProcessor

  constructor(width: number = 10, height: number = 20) {
    this.board = {
      grid: this.createEmptyGrid(width, height),
      width,
      height
    }
    
    this.collisionDetector = new CollisionDetector(
      this.board.grid,
      this.board.width,
      this.board.height
    )
    
    this.lineClearProcessor = new LineClearProcessor(
      this.board.grid,
      this.board.width,
      this.board.height
    )
  }

  private createEmptyGrid(width: number, height: number): CellState[][] {
    return Array.from({ length: height }, () =>
      Array.from({ length: width }, () => CellState.EMPTY)
    )
  }

  // 检查方块是否可以放置
  canPlace(piece: PieceInstance, position: Position): boolean {
    return this.collisionDetector.canPlace(piece, position)
  }

  // 放置方块到棋盘
  placePiece(piece: PieceInstance, position: Position): PlacementResult {
    if (!this.canPlace(piece, position)) {
      return { success: false }
    }

    // 将方块放置到棋盘上
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const boardX = position.x + col
          const boardY = position.y + row
          
          if (boardY >= 0 && boardY < this.board.height) {
            this.board.grid[boardY][boardX] = CellState.FILLED
          }
        }
      }
    }

    // 检查并清除满行
    const linesCleared = this.lineClearProcessor.clearLines()

    return {
      success: true,
      position,
      linesCleared
    }
  }

  // 找到方块直接下落的位置
  findDropPosition(piece: PieceInstance, startPosition: Position): Position {
    return this.collisionDetector.findDropPosition(piece, startPosition)
  }

  // 检查方块是否已着陆
  hasLanded(piece: PieceInstance, position: Position): boolean {
    return this.collisionDetector.hasLanded(piece, position)
  }

  // 检查游戏是否结束
  isGameOver(newPiece: PieceInstance, position: Position = { x: 4, y: 0 }): boolean {
    return this.collisionDetector.isGameOver(newPiece, position)
  }

  // 生成AI所需的棋盘状态字符串
  generateAIState(currentPiece?: PieceInstance, position?: Position): string {
    // 创建棋盘副本用于渲染
    const displayGrid = this.board.grid.map(row => [...row])
    
    // 如果有当前方块，将其添加到显示网格中
    if (currentPiece && position) {
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col]) {
            const boardX = position.x + col
            const boardY = position.y + row
            
            if (boardX >= 0 && boardX < this.board.width && 
                boardY >= 0 && boardY < this.board.height) {
              displayGrid[boardY][boardX] = CellState.FILLED
            }
          }
        }
      }
    }

    // 转换为字符串格式
    return displayGrid
      .map(row => 
        row.map(cell => {
          if (currentPiece && position && this.isCellFromCurrentPiece(row, cell, currentPiece, position)) {
            return '×' // 当前下落的方块
          }
          return cell === CellState.FILLED ? '+' : '.' // 已落稳的方块或空白
        }).join('')
      )
      .join('\\n')
  }

  private isCellFromCurrentPiece(
    rowIndex: number, 
    cell: CellState, 
    currentPiece: PieceInstance, 
    position: Position
  ): boolean {
    // 这里需要更复杂的逻辑来区分当前方块和已放置方块
    // 为简化，先使用基本实现
    return false
  }

  // 清空棋盘
  clear(): void {
    this.board.grid = this.createEmptyGrid(this.board.width, this.board.height)
  }

  // 获取棋盘状态
  get grid(): CellState[][] {
    return this.board.grid.map(row => [...row]) // 返回副本
  }

  get width(): number {
    return this.board.width
  }

  get height(): number {
    return this.board.height
  }

  // 检查指定行是否已满
  isLineFull(row: number): boolean {
    return this.collisionDetector.isLineFull(row)
  }

  // 获取最高填充行
  getTopFilledRow(): number {
    return this.lineClearProcessor.getTopFilledRow()
  }

  // 检查棋盘是否为空
  isEmpty(): boolean {
    return this.board.grid.every(row =>
      row.every(cell => cell === CellState.EMPTY)
    )
  }
}

export * from './types'
export * from './collision'
export * from './line-clear'