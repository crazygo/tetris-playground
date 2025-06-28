// UI Components 模块导出

export { GameBoard } from './GameBoard'
export { NextPieces } from './NextPieces'
export { ScoreDisplay } from './ScoreDisplay'
export { ControlPanel } from './ControlPanel'
export { PromptEditor } from './PromptEditor'

// 共享组件接口
export interface BaseComponentProps {
  className?: string
}