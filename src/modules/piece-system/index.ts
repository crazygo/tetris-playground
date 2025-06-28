import { PieceType, Direction } from '@/types'
import { PieceInstance, RotationDirection } from './types'
import { PIECE_SHAPES } from './shapes'

export class PieceSystem {
  private currentPiece: PieceInstance | null = null
  private nextPieces: PieceInstance[] = []
  private bag: PieceType[] = []

  constructor() {
    this.refillBag()
    this.generateNextPieces()
  }

  // 7-bag随机算法
  private refillBag(): void {
    this.bag = [
      PieceType.I, PieceType.O, PieceType.T, PieceType.S,
      PieceType.Z, PieceType.J, PieceType.L
    ]
    // Fisher-Yates洗牌
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]]
    }
  }

  private generateNextPieces(): void {
    while (this.nextPieces.length < 3) {
      if (this.bag.length === 0) {
        this.refillBag()
      }
      const pieceType = this.bag.pop()!
      this.nextPieces.push(this.createPieceInstance(pieceType))
    }
  }

  private createPieceInstance(type: PieceType, rotation: number = 0): PieceInstance {
    const shape = PIECE_SHAPES[type]
    return {
      type,
      shape: shape.rotations[rotation],
      color: shape.color,
      rotation,
      position: { x: 4, y: 0 } // 棋盘中央顶部
    }
  }

  // 生成下一个方块
  spawnNext(): PieceInstance {
    const nextPiece = this.nextPieces.shift()!
    this.generateNextPieces()
    this.currentPiece = nextPiece
    return nextPiece
  }

  // 旋转方块
  rotatePiece(piece: PieceInstance, degrees: RotationDirection): PieceInstance {
    const newRotation = (piece.rotation + degrees / 90) % 4
    const shape = PIECE_SHAPES[piece.type]
    
    return {
      ...piece,
      rotation: newRotation,
      shape: shape.rotations[newRotation]
    }
  }

  // 移动方块
  movePiece(piece: PieceInstance, direction: Direction, steps: number = 1): PieceInstance {
    const newPosition = { ...piece.position }
    
    switch (direction) {
      case Direction.LEFT:
        newPosition.x -= steps
        break
      case Direction.RIGHT:
        newPosition.x += steps
        break
      case Direction.DOWN:
        newPosition.y += steps
        break
    }
    
    return {
      ...piece,
      position: newPosition
    }
  }

  // 为AI生成方块字符串表示
  generateAIPieceStrings(): string[] {
    return this.nextPieces.map(piece => this.pieceToString(piece))
  }

  private pieceToString(piece: PieceInstance): string {
    return piece.shape
      .map(row => 
        row.map(cell => cell ? '×' : '.').join('')
      )
      .join('\\n')
  }

  // Getters
  get current(): PieceInstance | null {
    return this.currentPiece
  }

  get next(): PieceInstance[] {
    return [...this.nextPieces]
  }

  // 重置系统
  reset(): void {
    this.currentPiece = null
    this.nextPieces = []
    this.bag = []
    this.refillBag()
    this.generateNextPieces()
  }
}

export * from './types'
export * from './shapes'