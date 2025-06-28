'use client'

import { useState } from 'react'

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

interface PromptEditorProps {
  value: string
  onChange: (value: string) => void
  onValidate: () => Promise<ValidationResult>
  validationResult?: ValidationResult
  isValidating?: boolean
  examplePrompts?: string[]
  className?: string
}

export function PromptEditor({ 
  value, 
  onChange, 
  onValidate,
  validationResult,
  isValidating = false,
  examplePrompts = [],
  className = '' 
}: PromptEditorProps) {
  const [showExamples, setShowExamples] = useState(false)

  const handleValidate = async () => {
    await onValidate()
  }

  const handleExampleSelect = (example: string) => {
    onChange(example)
    setShowExamples(false)
  }

  return (
    <div className={`prompt-editor ${className}`}>
      <h3 className="text-lg font-bold mb-4 border-b border-white pb-2">
        AI策略配置
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2">
            策略描述:
          </label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input w-full h-32 resize-none text-sm"
            placeholder="请描述你的俄罗斯方块AI策略..."
            disabled={isValidating}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleValidate}
            disabled={isValidating || !value.trim()}
            className="btn flex-1 py-2 text-sm disabled:opacity-50"
          >
            {isValidating ? '验证中...' : '验证策略'}
          </button>
          
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="btn px-4 py-2 text-sm border-gray-500"
          >
            示例
          </button>
        </div>
        
        {/* 验证结果 */}
        {validationResult && (
          <div className={`
            text-sm p-3 border
            ${validationResult.isValid 
              ? 'border-green-500 text-green-400' 
              : 'border-red-500 text-red-400'
            }
          `}>
            {validationResult.isValid ? (
              <div>✓ 策略验证成功</div>
            ) : (
              <div>
                <div>✗ 验证失败:</div>
                <ul className="mt-1 list-disc list-inside">
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* 示例列表 */}
        {showExamples && examplePrompts.length > 0 && (
          <div className="border border-white p-3">
            <div className="text-sm font-bold mb-2">示例策略:</div>
            <div className="space-y-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleSelect(example)}
                  className="block w-full text-left text-xs p-2 border border-gray-500 hover:bg-white hover:text-black transition-colors"
                >
                  {example.substring(0, 80)}...
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}