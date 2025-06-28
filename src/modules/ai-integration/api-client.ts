import { AIGameState, GameAction, ValidationResult, AIResponse } from './types'

// 客户端API调用类，通过服务器API路由与AI交互
export class APIClient {
  // 验证Prompt
  async validatePrompt(prompt: string): Promise<ValidationResult> {
    try {
      const response = await fetch('/api/ai/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Prompt validation failed:', error)
      return {
        isValid: false,
        errors: ['网络错误或服务器异常']
      }
    }
  }

  // AI决策
  async makeDecision(gameState: AIGameState, userPrompt: string): Promise<AIResponse> {
    try {
      const response = await fetch('/api/ai/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameState, userPrompt }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('AI decision failed:', error)
      
      // 网络错误时的回退策略
      const fallbackActions = [
        { type: 'down' as const, parameters: {} },
        { type: 'left' as const, parameters: { step: 1 } },
        { type: 'right' as const, parameters: { step: 1 } }
      ]
      
      const fallbackAction = fallbackActions[Math.floor(Math.random() * fallbackActions.length)]
      
      return {
        action: fallbackAction,
        reasoning: '网络错误，使用随机动作'
      }
    }
  }

  // 获取AI状态
  async getStatus(): Promise<{
    isConfigured: boolean
    mode: string
    status: string
    baseURL?: string
    model?: string
    hasApiKey?: boolean
  }> {
    try {
      const response = await fetch('/api/ai/status')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('AI status check failed:', error)
      return {
        isConfigured: false,
        mode: 'Unknown',
        status: '状态检查失败'
      }
    }
  }
}