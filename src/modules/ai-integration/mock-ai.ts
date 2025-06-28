import { GameAction, AIGameState, AIResponse } from './types'

// 模拟AI决策，返回随机指令
export class MockAI {
  private actions: GameAction[] = [
    { type: 'left', parameters: { step: 1 } },
    { type: 'left', parameters: { step: 2 } },
    { type: 'right', parameters: { step: 1 } },
    { type: 'right', parameters: { step: 2 } },
    { type: 'rotate_right', parameters: { deg: 90 } },
    { type: 'rotate_right', parameters: { deg: 180 } },
    { type: 'rotate_right', parameters: { deg: 270 } },
    { type: 'down', parameters: {} }
  ]

  async makeDecision(gameState: AIGameState, userPrompt: string): Promise<AIResponse> {
    // 模拟AI思考时间
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
    
    // 简单的启发式规则，增加下落指令的概率
    const random = Math.random()
    let selectedAction: GameAction
    
    if (random < 0.3) {
      // 30%概率直接下落
      selectedAction = { type: 'down', parameters: {} }
    } else if (random < 0.5) {
      // 20%概率旋转
      const rotations = [90, 180, 270] as const
      const deg = rotations[Math.floor(Math.random() * rotations.length)]
      selectedAction = { type: 'rotate_right', parameters: { deg } }
    } else {
      // 50%概率移动
      const moveActions = this.actions.filter(action => 
        action.type === 'left' || action.type === 'right'
      )
      selectedAction = moveActions[Math.floor(Math.random() * moveActions.length)]
    }

    return {
      action: selectedAction,
      reasoning: this.generateReasoning(selectedAction, gameState)
    }
  }

  private generateReasoning(action: GameAction, gameState: AIGameState): string {
    const reasonings = {
      'down': '直接下落以加快游戏进度',
      'left': `向左移动${action.parameters.step}步以调整位置`,
      'right': `向右移动${action.parameters.step}步以调整位置`,
      'rotate_right': `旋转${action.parameters.deg}度以寻找更好的放置角度`
    }
    
    return reasonings[action.type] || '执行随机策略'
  }

  // 验证用户Prompt（模拟验证）
  async validatePrompt(prompt: string): Promise<{ isValid: boolean; errors: string[] }> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    if (!prompt || prompt.trim().length < 10) {
      return {
        isValid: false,
        errors: ['Prompt太短，至少需要10个字符']
      }
    }
    
    if (prompt.length > 1000) {
      return {
        isValid: false,
        errors: ['Prompt太长，最多1000个字符']
      }
    }
    
    return {
      isValid: true,
      errors: []
    }
  }
}