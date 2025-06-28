// AI Configuration
// This file contains the configuration for OpenRouter AI integration

export const AI_CONFIG = {
  // AI Gateway Base URL (supports Cloudflare AI Gateway for debugging)
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  
  // Default model - fast and cost-effective for development
  defaultModel: process.env.OPENROUTER_MODEL || 'microsoft/wizardlm-2-8x22b',
  
  // Request headers for OpenRouter
  headers: {
    'HTTP-Referer': process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
    'X-Title': 'Tetris-Playground',
    'Content-Type': 'application/json',
  },
  
  // Generation parameters
  maxTokens: parseInt(process.env.OPENROUTER_MAX_TOKENS || '1000'),
  temperature: parseFloat(process.env.OPENROUTER_TEMPERATURE || '0.7'),
  
  // API Key (from environment)
  apiKey: process.env.OPENROUTER_API_KEY,
}

// Validation function
export function validateAIConfig(): { isValid: boolean; missingVars: string[]; configInfo: any } {
  const missingVars: string[] = []
  
  if (!AI_CONFIG.apiKey) {
    missingVars.push('OPENROUTER_API_KEY')
  }
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
    configInfo: {
      baseURL: AI_CONFIG.baseURL,
      model: AI_CONFIG.defaultModel,
      hasApiKey: !!AI_CONFIG.apiKey,
      apiKeyPreview: AI_CONFIG.apiKey ? `${AI_CONFIG.apiKey.slice(0, 8)}...` : 'not set'
    }
  }
}

// Helper function to check if AI is available
export function isAIAvailable(): boolean {
  return validateAIConfig().isValid
}