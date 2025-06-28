'use client'

interface ScoreDisplayProps {
  score: number
  level: number
  linesCleared: number
  timeElapsed: number
  className?: string
}

export function ScoreDisplay({ 
  score, 
  level, 
  linesCleared, 
  timeElapsed, 
  className = '' 
}: ScoreDisplayProps) {
  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`score-display ${className}`}>
      <h3 className="text-lg font-bold mb-4 border-b border-white pb-2">
        游戏统计
      </h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>得分:</span>
          <span className="font-mono">{score.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span>等级:</span>
          <span className="font-mono">{level}</span>
        </div>
        
        <div className="flex justify-between">
          <span>消除行数:</span>
          <span className="font-mono">{linesCleared}</span>
        </div>
        
        <div className="flex justify-between">
          <span>游戏时间:</span>
          <span className="font-mono">{formatTime(timeElapsed)}</span>
        </div>
      </div>
    </div>
  )
}