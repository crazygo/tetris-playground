'use client'

import { PieceInstance } from '../../piece-system/types'

interface NextPiecesProps {
  pieces: PieceInstance[]
  className?: string
}

export function NextPieces({ pieces, className = '' }: NextPiecesProps) {
  const renderPiece = (piece: PieceInstance, index: number) => (
    <div key={index} className="next-piece text-center">
      <div className="text-xs mb-1">Next {index + 1}</div>
      <div className="border border-white inline-block">
        {piece.shape.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`
                  w-3 h-3 border border-white
                  ${cell ? 'bg-white' : 'bg-black'}
                `}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className={`next-pieces ${className}`}>
      <h3 className="text-lg font-bold mb-4 border-b border-white pb-2">
        预览方块
      </h3>
      <div className="flex gap-4 justify-center">
        {pieces.slice(0, 3).map((piece, index) => renderPiece(piece, index))}
      </div>
    </div>
  )
}