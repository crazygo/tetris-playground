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
  // Step功能
  onStep?: () => void
  onMultiStep?: () => void
  isProcessing?: boolean
  aiReady?: boolean
  // 日志功能
  actionLog?: string[]
}

export function PromptEditor({ 
  value, 
  onChange, 
  onValidate,
  validationResult,
  isValidating = false,
  examplePrompts = [],
  className = '',
  onStep,
  onMultiStep,
  isProcessing = false,
  aiReady = false,
  actionLog = []
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
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm">
              策略描述:
            </label>
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="btn px-3 py-1 text-xs border-gray-500"
            >
              示例策略
            </button>
          </div>
          
          {/* 示例列表 - 移到输入框上方 */}
          {showExamples && examplePrompts.length > 0 && (
            <div className="border border-white p-3 mb-3">
              <div className="text-sm font-bold mb-2">选择示例策略:</div>
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
          
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input w-full h-32 resize-none text-sm"
            placeholder="请描述你的俄罗斯方块AI策略..."
            disabled={isValidating}
          />
        </div>
        
        {/* 三个按钮同行 */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleValidate}
            disabled={isValidating || !value.trim()}
            className="btn py-2 text-xs disabled:opacity-50"
          >
            {isValidating ? '验证中...' : '验证策略'}
          </button>
          
          {onStep && (
            <button
              onClick={onStep}
              disabled={isProcessing || !aiReady || !validationResult?.isValid}
              className="btn py-2 text-xs disabled:opacity-50"
            >
              {isProcessing ? '执行中...' : 'One Step'}
            </button>
          )}
          
          {onMultiStep && (
            <button
              onClick={onMultiStep}
              disabled={isProcessing || !aiReady || !validationResult?.isValid}
              className="btn py-2 text-xs disabled:opacity-50"
            >
              {isProcessing ? '执行中...' : '5 Steps'}
            </button>
          )}
        </div>
        
        {/* 执行日志 */}
        <div className="mt-4 p-3 border border-white">
          <h4 className="text-sm font-bold mb-2 border-b border-white pb-1">
            执行日志
          </h4>
          <div className="h-32 overflow-y-auto text-xs space-y-1 font-mono">
            {actionLog.length === 0 ? (
              <div className="text-gray-500">暂无执行记录</div>
            ) : (
              actionLog.map((log, index) => (
                <div key={index} className="text-gray-300">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* 验证错误结果（只显示错误） */}
        {validationResult && !validationResult.isValid && (
          <div className="text-sm p-3 border border-red-500 text-red-400">
            <div>✗ 验证失败:</div>
            <ul className="mt-1 list-disc list-inside">
              {validationResult.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}