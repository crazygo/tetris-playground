import { NextRequest, NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { AI_CONFIG, validateAIConfig } from '@/config/ai'

// Action schema for structured generation
const ActionSchema = z.object({
  type: z.enum(['rotate_right', 'down', 'left', 'right']),
  parameters: z.object({
    deg: z.enum([90, 180, 270]).optional(),
    step: z.number().min(1).max(20).optional(),
  }),
  reasoning: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const { gameState, userPrompt } = await request.json()

    // 验证请求数据
    if (!gameState || !userPrompt) {
      return NextResponse.json({
        error: '缺少游戏状态或用户策略'
      }, { status: 400 })
    }

    // 检查AI配置
    const configValidation = validateAIConfig()
    if (!configValidation.isValid) {
      // 使用随机决策作为回退
      const mockActions = [
        { type: 'left', parameters: { step: 1 } },
        { type: 'right', parameters: { step: 1 } },
        { type: 'rotate_right', parameters: { deg: 90 } },
        { type: 'down', parameters: {} }
      ]
      
      const randomAction = mockActions[Math.floor(Math.random() * mockActions.length)]
      
      return NextResponse.json({
        action: randomAction,
        reasoning: 'Mock AI随机决策 (未配置OpenRouter)'
      })
    }

    // 构建System Prompt
    const systemPrompt = `你是一个俄罗斯方块AI代理。当前游戏状态：

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

    // 配置AI客户端
    const openaiProvider = createOpenAI({
      baseURL: AI_CONFIG.baseURL,
      apiKey: AI_CONFIG.apiKey,
      headers: AI_CONFIG.headers,
    })

    // 调用AI进行决策
    const result = await generateObject({
      model: openaiProvider(AI_CONFIG.defaultModel),
      schema: ActionSchema,
      prompt: `${systemPrompt}\n\n用户策略: ${userPrompt}\n\n请根据当前局面和用户策略，选择最佳的下一步操作。`,
      temperature: AI_CONFIG.temperature,
      maxTokens: AI_CONFIG.maxTokens,
    })

    return NextResponse.json({
      action: {
        type: result.object.type,
        parameters: result.object.parameters || {},
      },
      reasoning: result.object.reasoning || '基于用户策略的决策',
    })

  } catch (error) {
    console.error('AI decision error:', error)
    
    // 错误时返回随机决策
    const fallbackActions = [
      { type: 'down', parameters: {} },
      { type: 'left', parameters: { step: 1 } },
      { type: 'right', parameters: { step: 1 } }
    ]
    
    const fallbackAction = fallbackActions[Math.floor(Math.random() * fallbackActions.length)]
    
    return NextResponse.json({
      action: fallbackAction,
      reasoning: '决策失败，使用随机动作'
    })
  }
}