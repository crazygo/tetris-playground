import { GameEngine } from '../index'
import { GameState } from '@/types'

describe('GameEngine', () => {
  let gameEngine: GameEngine
  let mockCallbacks: any

  beforeEach(() => {
    mockCallbacks = {
      onGameOver: jest.fn(),
      onScoreUpdate: jest.fn(),
      onStateChange: jest.fn(),
      onLinesCleared: jest.fn()
    }
    gameEngine = new GameEngine(mockCallbacks)
  })

  describe('初始化', () => {
    test('应该以正确的初始状态创建', () => {
      const state = gameEngine.gameState
      
      expect(state.gameState).toBe(GameState.WAITING)
      expect(state.score).toBe(0)
      expect(state.level).toBe(1)
      expect(state.linesCleared).toBe(0)
      expect(state.isRunning).toBe(false)
    })
  })

  describe('游戏控制', () => {
    test('start()应该初始化游戏', () => {
      gameEngine.start()
      const state = gameEngine.gameState
      
      expect(state.isRunning).toBe(true)
      expect(state.gameState).toBe(GameState.WAITING)
      expect(state.startTime).toBeDefined()
      expect(gameEngine.currentPieceData).not.toBeNull()
    })

    test('pause()应该暂停游戏', () => {
      gameEngine.start()
      gameEngine.pause()
      
      expect(gameEngine.gameState.isRunning).toBe(false)
      expect(gameEngine.gameState.gameState).toBe(GameState.WAITING)
    })

    test('reset()应该重置所有状态', () => {
      gameEngine.start()
      gameEngine.reset()
      
      const state = gameEngine.gameState
      expect(state.score).toBe(0)
      expect(state.isRunning).toBe(false)
      expect(gameEngine.currentPieceData).toBeNull()
    })
  })

  describe('AI集成', () => {
    test('应该能设置AI Prompt', () => {
      const prompt = '测试AI策略'
      gameEngine.setAIPrompt(prompt)
      expect(gameEngine.aiReady).toBe(false) // 未验证
    })

    test('应该能验证AI Prompt', async () => {
      gameEngine.setAIPrompt('这是一个足够长的AI策略描述用于测试')
      const result = await gameEngine.validateAIPrompt()
      
      expect(result.isValid).toBe(true)
      expect(gameEngine.aiReady).toBe(true)
    })
  })

  describe('单步执行', () => {
    beforeEach(async () => {
      gameEngine.start()
      gameEngine.setAIPrompt('测试策略：优先下落方块以加快游戏进度')
      await gameEngine.validateAIPrompt()
    })

    test('AI就绪时应该能执行单步', async () => {
      const result = await gameEngine.executeStep()
      
      // 由于使用随机AI，结果可能成功或失败，但应该有响应
      expect(result).toBeDefined()
      expect(typeof result.success).toBe('boolean')
    }, 10000) // 增加超时时间

    test('AI未就绪时应该拒绝执行', async () => {
      gameEngine.reset()
      gameEngine.start()
      // 不设置AI Prompt
      
      const result = await gameEngine.executeStep()
      expect(result.success).toBe(false)
      expect(result.error).toContain('AI未就绪')
    })

    test('游戏未运行时应该拒绝执行', async () => {
      gameEngine.pause()
      
      const result = await gameEngine.executeStep()
      expect(result.success).toBe(false)
    })
  })

  describe('状态管理', () => {
    test('应该正确报告当前状态', () => {
      expect(gameEngine.gameState.gameState).toBe(GameState.WAITING)
      expect(gameEngine.currentBoard).toBeDefined()
      expect(gameEngine.nextPieces).toHaveLength(3)
    })

    test('开始游戏后应该有当前方块', () => {
      gameEngine.start()
      const pieceData = gameEngine.currentPieceData
      
      expect(pieceData).not.toBeNull()
      expect(pieceData?.piece).toBeDefined()
      expect(pieceData?.position).toBeDefined()
    })
  })

  describe('回调函数', () => {
    test('状态改变时应该触发回调', () => {
      gameEngine.start()
      
      expect(mockCallbacks.onStateChange).toHaveBeenCalledWith(GameState.WAITING)
    })
  })
})