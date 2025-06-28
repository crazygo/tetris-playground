import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { AI_CONFIG, validateAIConfig } from '@/config/ai'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    // 基础验证
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({
        isValid: false,
        errors: ['请提供有效的策略描述']
      })
    }

    if (prompt.trim().length < 10) {
      return NextResponse.json({
        isValid: false,
        errors: ['策略描述太短，至少需要10个字符']
      })
    }

    if (prompt.length > 2000) {
      return NextResponse.json({
        isValid: false,
        errors: ['策略描述太长，最多2000个字符']
      })
    }

    // 检查AI配置
    const configValidation = validateAIConfig()
    if (!configValidation.isValid) {
      // 如果没有AI配置，只进行基础验证
      return NextResponse.json({
        isValid: true,
        errors: []
      })
    }

    // 使用AI进行高级验证
    try {
      const openaiProvider = createOpenAI({
        baseURL: AI_CONFIG.baseURL,
        apiKey: AI_CONFIG.apiKey,
        headers: AI_CONFIG.headers,
      })

      const result = await generateText({
        model: openaiProvider(AI_CONFIG.defaultModel),
        prompt: `请评估以下俄罗斯方块AI策略是否合理和可执行。只回答"有效"或"无效：[原因]"：\n\n${prompt}`,
        maxTokens: 100,
        temperature: 0.3,
      })

      if (result.text.includes('无效')) {
        return NextResponse.json({
          isValid: false,
          errors: ['AI评估策略不够明确或存在逻辑问题']
        })
      }

      return NextResponse.json({
        isValid: true,
        errors: []
      })
    } catch (aiError) {
      console.warn('AI验证失败，使用基础验证:', aiError)
      // AI验证失败不影响基本验证结果
      return NextResponse.json({
        isValid: true,
        errors: []
      })
    }
  } catch (error) {
    console.error('Prompt validation error:', error)
    return NextResponse.json({
      isValid: false,
      errors: ['验证过程出错']
    }, { status: 500 })
  }
}