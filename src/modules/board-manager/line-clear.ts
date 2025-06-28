import { CellState } from '@/types'
import { ClearLinesResult } from './types'

export class LineClearProcessor {
  constructor(
    private grid: CellState[][],
    private width: number,
    private height: number
  ) {}

  // 检测并清除满行
  clearLines(): ClearLinesResult {
    const fullRows: number[] = []
    
    // 找出所有满行
    for (let row = 0; row < this.height; row++) {
      if (this.isLineFull(row)) {
        fullRows.push(row)
      }
    }

    if (fullRows.length === 0) {
      return {
        linesCleared: 0,
        points: 0,
        clearedRows: []
      }
    }

    // 从底部开始清除行
    fullRows.reverse().forEach(row => {
      this.removeLine(row)
      this.dropLinesAbove(row)
    })

    // 计算得分（标准俄罗斯方块得分规则）
    const points = this.calculatePoints(fullRows.length)

    return {
      linesCleared: fullRows.length,
      points,
      clearedRows: fullRows
    }
  }

  private isLineFull(row: number): boolean {
    return this.grid[row].every(cell => cell === CellState.FILLED)
  }

  private removeLine(row: number): void {
    // 清空指定行
    for (let col = 0; col < this.width; col++) {
      this.grid[row][col] = CellState.EMPTY
    }
  }

  private dropLinesAbove(clearedRow: number): void {
    // 将清除行上方的所有行向下移动一行
    for (let row = clearedRow; row > 0; row--) {
      for (let col = 0; col < this.width; col++) {
        this.grid[row][col] = this.grid[row - 1][col]
      }
    }
    
    // 清空顶行
    for (let col = 0; col < this.width; col++) {
      this.grid[0][col] = CellState.EMPTY
    }
  }

  private calculatePoints(linesCleared: number): number {
    // 标准俄罗斯方块得分系统
    const basePoints = {
      1: 100,  // Single
      2: 300,  // Double
      3: 500,  // Triple
      4: 800   // Tetris
    }
    
    return basePoints[linesCleared as keyof typeof basePoints] || 0
  }

  // 获取当前棋盘上已填充的行数
  getFilledRowCount(): number {
    let count = 0
    for (let row = 0; row < this.height; row++) {
      if (this.grid[row].some(cell => cell === CellState.FILLED)) {
        count++
      }
    }
    return count
  }

  // 获取棋盘的最高点（最上面的filled行）
  getTopFilledRow(): number {
    for (let row = 0; row < this.height; row++) {
      if (this.grid[row].some(cell => cell === CellState.FILLED)) {
        return row
      }
    }
    return this.height - 1 // 如果没有填充行，返回底部
  }
}