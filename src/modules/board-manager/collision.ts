import { CellState, Position } from '@/types'
import { PieceInstance } from '../piece-system/types'

export class CollisionDetector {
  constructor(
    private grid: CellState[][],
    private width: number,
    private height: number
  ) {}

  // 检查方块是否可以放置在指定位置
  canPlace(piece: PieceInstance, position: Position): boolean {
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const boardX = position.x + col
          const boardY = position.y + row

          // 检查边界
          if (boardX < 0 || boardX >= this.width || boardY >= this.height) {
            return false
          }

          // 检查底部边界（方块可以在顶部边界外开始）
          if (boardY < 0) {
            continue
          }

          // 检查与已有方块的碰撞
          if (this.grid[boardY][boardX] === CellState.FILLED) {
            return false
          }
        }
      }
    }
    return true
  }

  // 检查方块是否已经着陆（不能再下移）
  hasLanded(piece: PieceInstance, position: Position): boolean {
    const newPosition = { x: position.x, y: position.y + 1 }
    return !this.canPlace(piece, newPosition)
  }

  // 找到方块直接下落的最终位置
  findDropPosition(piece: PieceInstance, startPosition: Position): Position {
    let position = { ...startPosition }
    
    // 确保起始位置是有效的
    if (!this.canPlace(piece, position)) {
      console.error('findDropPosition: 起始位置无效', position)
      return position
    }
    
    // 从当前位置开始，一步步向下查找最后一个有效位置
    let lastValidPosition = { ...position }
    
    while (position.y < this.height - 1) {  // 防止越界
      const nextPosition = { x: position.x, y: position.y + 1 }
      
      // 检查下一个位置是否可放置
      if (this.canPlace(piece, nextPosition)) {
        // 可以放置，更新位置并继续
        position = nextPosition
        lastValidPosition = { ...position }
      } else {
        // 不能放置，返回最后一个有效位置
        break
      }
    }
    
    return lastValidPosition
  }

  // 检查指定行是否已满
  isLineFull(row: number): boolean {
    if (row < 0 || row >= this.height) return false
    return this.grid[row].every(cell => cell === CellState.FILLED)
  }

  // 检查游戏是否结束（顶部有方块且无法移动）
  isGameOver(newPiece: PieceInstance, position: Position = { x: 4, y: 0 }): boolean {
    return !this.canPlace(newPiece, position)
  }
}