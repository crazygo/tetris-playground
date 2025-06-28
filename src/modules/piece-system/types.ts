import { PieceType, Position } from '@/types'

export interface PieceShape {
  type: PieceType
  rotations: boolean[][][]  // 4个旋转状态的形状数据
  color: string
}

export interface PieceInstance {
  type: PieceType
  shape: boolean[][]
  color: string
  rotation: number
  position: Position
}

export enum RotationDirection {
  CLOCKWISE = 90,
  HALF_TURN = 180,
  COUNTER_CLOCKWISE = 270
}