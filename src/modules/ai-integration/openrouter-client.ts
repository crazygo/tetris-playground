import { openai } from '@ai-sdk/openai'
import { generateObject, generateText } from 'ai'
import { AI_CONFIG, validateAIConfig } from '@/config/ai'
import { GameAction, AIGameState, AIResponse, FUNCTION_TOOLS } from './types'
import { z } from 'zod'

// Action schema for structured generation
const ActionSchema = z.object({
  type: z.enum(['rotate_right', 'down', 'left', 'right']),
  parameters: z.object({
    deg: z.enum([90, 180, 270]).optional(),
    step: z.number().min(1).max(20).optional(),
  }),
  reasoning: z.string().optional(),
})

export class OpenRouterClient {
  private client: any
  private isConfigured: boolean = false

  constructor() {
    const configValidation = validateAIConfig()
    
    if (!configValidation.isValid) {
      console.warn('AI配置不完整，缺少环境变量:', configValidation.missingVars)
      this.isConfigured = false
      return
    }

    // Log configuration for debugging
    console.log('🔧 AI配置信息:', {
      baseURL: configValidation.configInfo.baseURL,
      model: configValidation.configInfo.model,
      apiKey: configValidation.configInfo.apiKeyPreview
    })

    // Configure OpenAI client for OpenRouter/AI Gateway
    this.client = openai({
      baseURL: AI_CONFIG.baseURL,
      apiKey: AI_CONFIG.apiKey,
      defaultHeaders: AI_CONFIG.headers,
    })
    
    this.isConfigured = true
    console.log('✅ OpenRouter客户端已配置')
  }

  async makeDecision(gameState: AIGameState, userPrompt: string): Promise<AIResponse> {
    if (!this.isConfigured) {
      throw new Error('AI客户端未正确配置，请检查环境变量')
    }

    try {
      const systemPrompt = this.buildSystemPrompt(gameState)
      
      // Use generateObject for structured output
      const result = await generateObject({
        model: this.client(AI_CONFIG.defaultModel),
        schema: ActionSchema,
        prompt: `${systemPrompt}\n\n用户策略: ${userPrompt}\n\n请根据当前局面和用户策略，选择最佳的下一步操作。`,
        temperature: AI_CONFIG.temperature,
        maxTokens: AI_CONFIG.maxTokens,
      })

      return {
        action: {
          type: result.object.type,
          parameters: result.object.parameters || {},
        },
        reasoning: result.object.reasoning || '基于用户策略的决策',
      }
    } catch (error) {
      console.error('OpenRouter AI decision failed:', error)
      throw new Error(`AI决策失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  async validatePrompt(prompt: string): Promise<{ isValid: boolean; errors: string[] }> {
    if (!this.isConfigured) {
      return {
        isValid: false,
        errors: ['AI服务未配置']
      }
    }

    // Basic validation
    const errors: string[] = []
    
    if (!prompt || prompt.trim().length < 10) {
      errors.push('策略描述太短，至少需要10个字符')
    }
    
    if (prompt.length > 2000) {
      errors.push('策略描述太长，最多2000个字符')
    }

    // Advanced validation using AI (optional)
    if (errors.length === 0) {
      try {
        const result = await generateText({
          model: this.client(AI_CONFIG.defaultModel),
          prompt: `请评估以下俄罗斯方块AI策略是否合理和可执行。只回答"有效"或"无效：[原因]"：\n\n${prompt}`,
          maxTokens: 100,
          temperature: 0.3,
        })
        
        if (result.text.includes('无效')) {
          errors.push('AI评估策略不够明确或存在逻辑问题')
        }
      } catch (error) {
        // AI验证失败不影响基本验证结果
        console.warn('AI策略验证失败:', error)
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  private buildSystemPrompt(gameState: AIGameState): string {
    return `你是一个俄罗斯方块AI代理。当前游戏状态：

棋盘状态：
${gameState.boardState}

当前方块：
${gameState.currentPiece}

后续3个方块：
${gameState.nextPieces.join('\n\n')}

可用操作：
- rotate_right(deg: 90|180|270): 顺时针旋转
- down(): 直接落到底部
- left(step: 1-20): 向左移动
- right(step: 1-20): 向右移动

请选择最佳操作。`
  }

  get isReady(): boolean {
    return this.isConfigured
  }

  get configStatus(): string {
    const validation = validateAIConfig()
    if (!this.isConfigured) {
      return `配置不完整: 缺少 ${validation.missingVars.join(', ')}`
    }
    
    const isCloudflareGateway = validation.configInfo.baseURL.includes('gateway.ai.cloudflare.com')
    const gatewayType = isCloudflareGateway ? 'Cloudflare AI Gateway' : 'Direct OpenRouter'
    
    return `${gatewayType} | ${validation.configInfo.model}`
  }
}