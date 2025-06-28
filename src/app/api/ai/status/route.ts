import { NextResponse } from 'next/server'
import { validateAIConfig } from '@/config/ai'

export async function GET() {
  try {
    const validation = validateAIConfig()
    
    const isCloudflareGateway = validation.configInfo?.baseURL?.includes('gateway.ai.cloudflare.com')
    const gatewayType = isCloudflareGateway ? 'Cloudflare AI Gateway' : 'Direct OpenRouter'
    
    return NextResponse.json({
      isConfigured: validation.isValid,
      mode: validation.isValid ? 'OpenRouter' : 'Mock',
      status: validation.isValid 
        ? `${gatewayType} | ${validation.configInfo.model}`
        : 'Mock AI (开发模式)',
      baseURL: validation.configInfo?.baseURL || 'not configured',
      model: validation.configInfo?.model || 'not configured',
      hasApiKey: validation.configInfo?.hasApiKey || false
    })
  } catch (error) {
    console.error('AI status check error:', error)
    return NextResponse.json({
      isConfigured: false,
      mode: 'Mock',
      status: 'Error checking configuration',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}