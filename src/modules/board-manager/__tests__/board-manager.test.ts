import { BoardManager } from '../index'
import { CellState, PieceType } from '@/types'
import { PieceInstance } from '../../piece-system/types'

describe('BoardManager', () => {
  let boardManager: BoardManager

  beforeEach(() => {
    boardManager = new BoardManager(10, 20)
  })

  const createTestPiece = (type: PieceType = PieceType.I): PieceInstance => ({
    type,
    shape: [
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
      [false, false, false, false]
    ],
    color: '#FFFFFF',
    rotation: 0,
    position: { x: 3, y: 0 }
  })

  describe('初始化', () => {
    test('应该创建空棋盘', () => {
      expect(boardManager.width).toBe(10)
      expect(boardManager.height).toBe(20)
      expect(boardManager.isEmpty()).toBe(true)
    })
  })

  describe('碰撞检测', () => {
    test('应该允许在空白区域放置方块', () => {
      const piece = createTestPiece()
      expect(boardManager.canPlace(piece, { x: 3, y: 10 })).toBe(true)
    })

    test('应该阻止越界放置', () => {
      const piece = createTestPiece()
      expect(boardManager.canPlace(piece, { x: -1, y: 10 })).toBe(false)
      expect(boardManager.canPlace(piece, { x: 8, y: 10 })).toBe(false)
      expect(boardManager.canPlace(piece, { x: 3, y: 19 })).toBe(false)
    })
  })

  describe('方块放置', () => {
    test('应该成功放置方块', () => {
      const piece = createTestPiece()
      const result = boardManager.placePiece(piece, { x: 3, y: 18 })
      
      expect(result.success).toBe(true)
      expect(boardManager.isEmpty()).toBe(false)
    })

    test('放置失败时应该返回失败结果', () => {
      const piece = createTestPiece()
      const result = boardManager.placePiece(piece, { x: -1, y: 10 })
      
      expect(result.success).toBe(false)
    })
  })

  describe('直接下落', () => {
    test('应该找到正确的下落位置', () => {
      const piece = createTestPiece()
      const dropPosition = boardManager.findDropPosition(piece, { x: 3, y: 0 })
      
      expect(dropPosition.x).toBe(3)
      expect(dropPosition.y).toBe(18) // 底部减去方块高度
    })
  })

  describe('消行检测', () => {
    test('应该检测满行并清除', () => {
      // 手动填充底行
      const grid = boardManager.grid
      for (let col = 0; col < 10; col++) {
        grid[19][col] = CellState.FILLED
      }
      
      expect(boardManager.isLineFull(19)).toBe(true)
    })
  })

  describe('AI数据生成', () => {
    test('应该生成正确的AI状态字符串', () => {
      const piece = createTestPiece()
      const aiState = boardManager.generateAIState(piece, { x: 3, y: 0 })
      
      expect(typeof aiState).toBe('string')
      expect(aiState).toMatch(/^[+×.\\n]+$/)
      expect(aiState.split('\\n')).toHaveLength(20) // 20行
    })
  })

  describe('游戏结束检测', () => {
    test('当方块无法放置在顶部时应该检测到游戏结束', () => {
      // 填充顶部区域
      const grid = boardManager.grid
      for (let col = 3; col < 7; col++) {
        grid[0][col] = CellState.FILLED
      }
      
      const piece = createTestPiece()
      expect(boardManager.isGameOver(piece)).toBe(true)
    })
  })

  describe('棋盘操作', () => {
    test('清空操作应该重置棋盘', () => {
      const piece = createTestPiece()
      boardManager.placePiece(piece, { x: 3, y: 18 })
      
      expect(boardManager.isEmpty()).toBe(false)
      
      boardManager.clear()
      expect(boardManager.isEmpty()).toBe(true)
    })
  })
})