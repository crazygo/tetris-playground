import { AIGameState, GameAction, ValidationResult, AIResponse, SYSTEM_PROMPT_TEMPLATE } from './types'
import { APIClient } from './api-client'

export class AIIntegration {
  private userPrompt: string = ''
  private apiClient: APIClient
  private isValidated: boolean = false
  private lastError?: string
  private aiStatus: any = null

  constructor() {
    this.apiClient = new APIClient()
    this.initializeStatus()
  }

  private async initializeStatus() {
    try {
      this.aiStatus = await this.apiClient.getStatus()
      console.log(`🤖 AI模式: ${this.aiStatus.mode}`)
    } catch (error) {
      console.warn('AI状态检查失败:', error)
      this.aiStatus = { isConfigured: false, mode: 'Unknown', status: '状态检查失败' }
    }
  }

  // 设置用户Prompt
  setUserPrompt(prompt: string): void {
    this.userPrompt = prompt
    this.isValidated = false
  }

  // 获取当前用户Prompt
  getUserPrompt(): string {
    return this.userPrompt
  }

  // 验证Prompt
  async validatePrompt(): Promise<ValidationResult> {
    try {
      const result = await this.apiClient.validatePrompt(this.userPrompt)
      this.isValidated = result.isValid
      this.lastError = result.isValid ? undefined : result.errors.join(', ')
      
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '验证过程出错'
      this.lastError = errorMessage
      return {
        isValid: false,
        errors: [errorMessage]
      }
    }
  }

  // AI决策
  async makeDecision(gameState: AIGameState): Promise<GameAction> {
    if (!this.isValidated) {
      throw new Error('Prompt未验证或验证失败')
    }

    try {
      const response = await this.apiClient.makeDecision(gameState, this.userPrompt)
      this.lastError = undefined
      return response.action
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'AI决策失败'
      this.lastError = errorMessage
      throw new Error(errorMessage)
    }
  }

  // 构建完整的AI请求数据
  buildAIRequest(gameState: AIGameState): {
    systemPrompt: string
    userPrompt: string
    gameState: AIGameState
  } {
    const systemPrompt = SYSTEM_PROMPT_TEMPLATE
      .replace('{state}', gameState.boardState)
      .replace('{next}', gameState.nextPieces.join('\\n\\n'))

    return {
      systemPrompt,
      userPrompt: this.userPrompt,
      gameState
    }
  }

  // 解析AI响应（模拟解析function call）
  parseAIResponse(response: any): GameAction {
    // 在实际实现中，这里会解析AI SDK返回的function call
    // 目前返回模拟数据
    if (response && response.action) {
      return response.action
    }
    
    throw new Error('无法解析AI响应')
  }

  // 状态检查
  get isReady(): boolean {
    return this.isValidated && !!this.userPrompt
  }

  get hasError(): boolean {
    return !!this.lastError
  }

  get error(): string | undefined {
    return this.lastError
  }

  get aiMode(): string {
    return this.aiStatus?.mode || 'Unknown'
  }

  get aiStatusText(): string {
    return this.aiStatus?.status || '状态检查中...'
  }

  // 重置状态
  reset(): void {
    this.userPrompt = ''
    this.isValidated = false
    this.lastError = undefined
  }

  // 获取示例Prompt
  getExamplePrompts(): string[] {
    return [
      '尽量将方块放置在棋盘中央，避免堆积过高。优先清除完整行以获得分数。',
      '使用贪心策略，每次都寻找能立即清除行的位置。如果没有，则选择最低的可用位置。',
      '保持棋盘平整，避免产生空洞。优先填充棋盘底部的空隙。',
      '激进策略：尽快下落方块，不过多考虑优化位置，追求快速游戏节奏。'
    ]
  }
}

export * from './types'
export * from './mock-ai'