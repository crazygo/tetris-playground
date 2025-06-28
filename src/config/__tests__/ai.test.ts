import { AI_CONFIG, validateAIConfig, isAIAvailable } from '../ai'

describe('AI Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('validateAIConfig', () => {
    test('应该检测缺失的API密钥', () => {
      delete process.env.OPENROUTER_API_KEY
      
      const result = validateAIConfig()
      
      expect(result.isValid).toBe(false)
      expect(result.missingVars).toContain('OPENROUTER_API_KEY')
    })

    test('有API密钥时应该验证通过', () => {
      process.env.OPENROUTER_API_KEY = 'test-key'
      
      const result = validateAIConfig()
      
      expect(result.isValid).toBe(true)
      expect(result.missingVars).toHaveLength(0)
    })
  })

  describe('isAIAvailable', () => {
    test('有配置时应该返回true', () => {
      process.env.OPENROUTER_API_KEY = 'test-key'
      
      expect(isAIAvailable()).toBe(true)
    })

    test('无配置时应该返回false', () => {
      delete process.env.OPENROUTER_API_KEY
      
      expect(isAIAvailable()).toBe(false)
    })
  })

  describe('AI_CONFIG', () => {
    test('应该有正确的默认值', () => {
      expect(AI_CONFIG.baseURL).toBe('https://openrouter.ai/api/v1')
      expect(AI_CONFIG.headers['X-Title']).toBe('Tetris-Playground')
      expect(AI_CONFIG.maxTokens).toBeGreaterThan(0)
      expect(AI_CONFIG.temperature).toBeGreaterThanOrEqual(0)
      expect(AI_CONFIG.temperature).toBeLessThanOrEqual(2)
    })
  })
})