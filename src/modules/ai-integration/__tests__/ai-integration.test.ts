import { AIIntegration } from '../index'
import { AIGameState } from '../types'

describe('AIIntegration', () => {
  let aiIntegration: AIIntegration

  beforeEach(() => {
    aiIntegration = new AIIntegration()
  })

  const mockGameState: AIGameState = {
    boardState: '..........\\n..........\\n..........',
    currentPiece: '××××\\n....\\n....\\n....',
    nextPieces: [
      '××\\n××\\n..\\n..',
      '.×.\\n×××\\n...\\n...',
      '××.\\n.××\\n...\\n...'
    ]
  }

  describe('Prompt管理', () => {
    test('应该能设置和获取用户Prompt', () => {
      const prompt = '测试策略：优先清除底行'
      aiIntegration.setUserPrompt(prompt)
      expect(aiIntegration.getUserPrompt()).toBe(prompt)
    })

    test('设置新Prompt后应该重置验证状态', () => {
      aiIntegration.setUserPrompt('第一个策略')
      aiIntegration.setUserPrompt('第二个策略')
      expect(aiIntegration.isReady).toBe(false)
    })
  })

  describe('Prompt验证', () => {
    test('应该拒绝太短的Prompt', async () => {
      aiIntegration.setUserPrompt('短')
      const result = await aiIntegration.validatePrompt()
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    test('应该接受合适长度的Prompt', async () => {
      aiIntegration.setUserPrompt('这是一个足够长的策略描述，用于测试验证功能')
      const result = await aiIntegration.validatePrompt()
      
      expect(result.isValid).toBe(true)
      expect(result.errors.length).toBe(0)
      expect(aiIntegration.isReady).toBe(true)
    })
  })

  describe('AI决策', () => {
    beforeEach(async () => {
      aiIntegration.setUserPrompt('测试策略：随机选择动作')
      await aiIntegration.validatePrompt()
    })

    test('验证通过后应该能进行AI决策', async () => {
      const action = await aiIntegration.makeDecision(mockGameState)
      
      expect(action).toBeDefined()
      expect(action.type).toMatch(/^(rotate_right|down|left|right)$/)
      expect(action.parameters).toBeDefined()
    })

    test('未验证时应该拒绝AI决策', async () => {
      const newAI = new AIIntegration()
      newAI.setUserPrompt('未验证的策略')
      
      await expect(newAI.makeDecision(mockGameState))
        .rejects.toThrow('Prompt未验证或验证失败')
    })
  })

  describe('AI请求构建', () => {
    test('应该正确构建AI请求数据', () => {
      aiIntegration.setUserPrompt('测试策略')
      const request = aiIntegration.buildAIRequest(mockGameState)
      
      expect(request.systemPrompt).toContain('你是俄罗斯方块的玩家代理')
      expect(request.systemPrompt).toContain(mockGameState.boardState)
      expect(request.userPrompt).toBe('测试策略')
      expect(request.gameState).toBe(mockGameState)
    })
  })

  describe('状态管理', () => {
    test('初始状态应该未就绪', () => {
      expect(aiIntegration.isReady).toBe(false)
      expect(aiIntegration.hasError).toBe(false)
    })

    test('重置后应该清空所有状态', async () => {
      aiIntegration.setUserPrompt('测试策略描述')
      await aiIntegration.validatePrompt()
      
      expect(aiIntegration.isReady).toBe(true)
      
      aiIntegration.reset()
      
      expect(aiIntegration.isReady).toBe(false)
      expect(aiIntegration.getUserPrompt()).toBe('')
    })
  })

  describe('示例Prompt', () => {
    test('应该提供示例Prompt', () => {
      const examples = aiIntegration.getExamplePrompts()
      
      expect(examples).toBeInstanceOf(Array)
      expect(examples.length).toBeGreaterThan(0)
      examples.forEach(example => {
        expect(typeof example).toBe('string')
        expect(example.length).toBeGreaterThan(10)
      })
    })
  })
})