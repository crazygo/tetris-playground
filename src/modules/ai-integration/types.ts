export interface AIGameState {
  boardState: string      // 棋盘字符串表示
  currentPiece: string    // 当前方块字符串表示
  nextPieces: string[]    // 后续3个方块
}

export interface GameAction {
  type: 'rotate_right' | 'down' | 'left' | 'right'
  parameters: {
    deg?: 90 | 180 | 270
    step?: number
  }
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface AIResponse {
  action: GameAction
  reasoning?: string
}

// 系统Prompt模板
export const SYSTEM_PROMPT_TEMPLATE = `你是俄罗斯方块的玩家代理，当前的棋盘是:
{state}
后续3个棋是:
{next}
请根据用户指定的策略输出当前步骤的指令`

// Function Tools定义
export const FUNCTION_TOOLS = [
  {
    name: 'rotate_right',
    description: '顺时针旋转当前方块',
    parameters: {
      type: 'object',
      properties: {
        deg: {
          type: 'number',
          enum: [90, 180, 270],
          description: '旋转角度：90度、180度或270度'
        }
      },
      required: ['deg']
    }
  },
  {
    name: 'down',
    description: '让当前方块直接落到底部',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'left',
    description: '向左移动当前方块',
    parameters: {
      type: 'object',
      properties: {
        step: {
          type: 'number',
          minimum: 1,
          maximum: 20,
          description: '移动步数（1-20）'
        }
      },
      required: ['step']
    }
  },
  {
    name: 'right',
    description: '向右移动当前方块',
    parameters: {
      type: 'object',
      properties: {
        step: {
          type: 'number',
          minimum: 1,
          maximum: 20,
          description: '移动步数（1-20）'
        }
      },
      required: ['step']
    }
  }
]