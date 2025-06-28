import { PieceSystem } from '../index'
import { PieceType, Direction } from '@/types'
import { RotationDirection } from '../types'

describe('PieceSystem', () => {
  let pieceSystem: PieceSystem

  beforeEach(() => {
    pieceSystem = new PieceSystem()
  })

  describe('初始化', () => {
    test('应该生成3个预览方块', () => {
      expect(pieceSystem.next).toHaveLength(3)
    })

    test('初始时当前方块应该为null', () => {
      expect(pieceSystem.current).toBeNull()
    })
  })

  describe('方块生成', () => {
    test('spawnNext应该返回方块并更新队列', () => {
      const piece = pieceSystem.spawnNext()
      
      expect(piece).toBeDefined()
      expect(piece.type).toMatch(/^[IOTSZJL]$/)
      expect(piece.position).toEqual({ x: 4, y: 0 })
      expect(pieceSystem.current).toBe(piece)
      expect(pieceSystem.next).toHaveLength(3)
    })
  })

  describe('方块旋转', () => {
    test('应该正确旋转T方块', () => {
      const piece = pieceSystem.spawnNext()
      if (piece.type !== PieceType.T) {
        // 为了测试确定性，直接创建T方块
        const tPiece = {
          type: PieceType.T,
          shape: [[false, false, false, false], [false, true, false, false], [true, true, true, false], [false, false, false, false]],
          color: '#FFFFFF',
          rotation: 0,
          position: { x: 4, y: 0 }
        }
        
        const rotated = pieceSystem.rotatePiece(tPiece, RotationDirection.CLOCKWISE)
        expect(rotated.rotation).toBe(1)
        expect(rotated.shape).not.toEqual(tPiece.shape)
      }
    })
  })

  describe('方块移动', () => {
    test('应该正确移动方块', () => {
      const piece = pieceSystem.spawnNext()
      
      const movedLeft = pieceSystem.movePiece(piece, Direction.LEFT, 2)
      expect(movedLeft.position.x).toBe(2)
      
      const movedRight = pieceSystem.movePiece(piece, Direction.RIGHT, 1)
      expect(movedRight.position.x).toBe(5)
      
      const movedDown = pieceSystem.movePiece(piece, Direction.DOWN, 3)
      expect(movedDown.position.y).toBe(3)
    })
  })

  describe('AI数据生成', () => {
    test('应该生成正确格式的方块字符串', () => {
      const strings = pieceSystem.generateAIPieceStrings()
      
      expect(strings).toHaveLength(3)
      strings.forEach(str => {
        expect(str).toMatch(/^[×.\\n]+$/)
        expect(str.split('\\n')).toHaveLength(4) // 4行
      })
    })
  })

  describe('重置', () => {
    test('重置后应该清空所有状态', () => {
      pieceSystem.spawnNext()
      pieceSystem.reset()
      
      expect(pieceSystem.current).toBeNull()
      expect(pieceSystem.next).toHaveLength(3)
    })
  })
})