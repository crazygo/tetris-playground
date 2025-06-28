'use client'

import { CellState, Position } from '@/types'
import { PieceInstance } from '../../piece-system/types'

interface GameBoardProps {
  grid: CellState[][]
  currentPiece?: PieceInstance
  currentPosition?: Position
  className?: string
}

export function GameBoard({ grid, currentPiece, currentPosition, className = '' }: GameBoardProps) {
  // 验证grid结构的完整性
  if (!grid || grid.length !== 20 || !grid.every(row => row && row.length === 10)) {
    console.error('GameBoard: Invalid grid structure', { 
      gridLength: grid?.length, 
      rowLengths: grid?.map(row => row?.length) 
    })
    // 返回安全的空棋盘
    const safeGrid = Array(20).fill(null).map(() => Array(10).fill(CellState.EMPTY))
    return (
      <div className={`game-board ${className}`}>
        <div className="grid grid-cols-10 gap-0 border-2 border-white inline-block">
          {safeGrid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="game-cell w-6 h-6 border border-white bg-black"
              />
            ))
          )}
        </div>
      </div>
    )
  }

  // 创建显示网格（包含当前方块）
  const displayGrid = grid.map(row => [...row])
  
  // 如果有当前方块，将其添加到显示网格
  if (currentPiece && currentPosition && 
      typeof currentPosition.x === 'number' && typeof currentPosition.y === 'number' &&
      !isNaN(currentPosition.x) && !isNaN(currentPosition.y)) {
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          const boardX = currentPosition.x + col
          const boardY = currentPosition.y + row
          
          // 严格的边界检查
          if (boardX >= 0 && boardX < 10 && boardY >= 0 && boardY < 20 && 
              displayGrid[boardY] && displayGrid[boardY][boardX] !== undefined) {
            displayGrid[boardY][boardX] = CellState.FILLED
          }
        }
      }
    }
  }

  return (
    <div className={`game-board ${className}`}>
      <div className="grid grid-cols-10 gap-0 border-2 border-white inline-block">
        {displayGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                game-cell w-6 h-6 border border-white
                ${cell === CellState.FILLED ? 'bg-white' : 'bg-black'}
              `}
            />
          ))
        )}
      </div>
    </div>
  )
}