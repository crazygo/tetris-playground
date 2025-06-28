import { GameState, Direction } from '@/types'
import { PieceSystem } from '../piece-system'
import { BoardManager } from '../board-manager'
import { AIIntegration } from '../ai-integration'
import { PieceInstance, RotationDirection } from '../piece-system/types'
import { GameEngineState, GameStats, StepResult, GameCallbacks } from './types'
import { GameAction } from '../ai-integration/types'

export class GameEngine {
  private pieceSystem: PieceSystem
  private boardManager: BoardManager
  private aiIntegration: AIIntegration
  private currentPiece: PieceInstance | null = null
  private currentPosition: { x: number; y: number } = { x: 4, y: 0 }
  private state: GameEngineState
  private callbacks: GameCallbacks = {}

  constructor(callbacks?: GameCallbacks) {
    this.pieceSystem = new PieceSystem()
    this.boardManager = new BoardManager()
    this.aiIntegration = new AIIntegration()
    this.callbacks = callbacks || {}
    
    this.state = {
      gameState: GameState.WAITING,
      score: 0,
      level: 1,
      linesCleared: 0,
      timeElapsed: 0,
      isRunning: false
    }
  }

  // 开始游戏
  start(): void {
    this.reset()
    this.state.startTime = new Date()
    this.state.isRunning = true
    this.spawnNewPiece()
    this.changeState(GameState.WAITING)
  }

  // 暂停游戏
  pause(): void {
    this.state.isRunning = false
    this.changeState(GameState.WAITING)
  }

  // 重置游戏
  reset(): void {
    this.pieceSystem.reset()
    this.boardManager.clear()
    this.currentPiece = null
    this.currentPosition = { x: 4, y: 0 }
    
    this.state = {
      gameState: GameState.WAITING,
      score: 0,
      level: 1,
      linesCleared: 0,
      timeElapsed: 0,
      isRunning: false
    }
    
    this.aiIntegration.reset()
  }

  // MVP版本：单步执行
  async executeStep(): Promise<StepResult> {
    if (!this.state.isRunning || this.state.gameState !== GameState.WAITING) {
      return { success: false, error: '游戏未在等待状态' }
    }

    if (!this.currentPiece) {
      return { success: false, error: '没有当前方块' }
    }

    if (!this.aiIntegration.isReady) {
      return { success: false, error: 'AI未就绪' }
    }

    try {
      this.changeState(GameState.PROCESSING)
      
      // 构建AI游戏状态
      const aiGameState = {
        boardState: this.boardManager.generateAIState(this.currentPiece, this.currentPosition),
        currentPiece: this.pieceToString(this.currentPiece),
        nextPieces: this.pieceSystem.generateAIPieceStrings()
      }

      // 获取AI决策
      const action = await this.aiIntegration.makeDecision(aiGameState)
      
      // 执行动作
      const result = await this.executeAction(action)
      
      // 无论AI动作是否成功，都要进入下落轮（除非游戏已结束或方块已经着陆）
      if (result.success && !result.gameOver && action.type !== 'down') {
        // 如果动作成功且不是直接下落，执行一次自动下落
        const autoDropResult = await this.executeAutoDropStep('AI执行后自动下落')
        
        this.changeState(GameState.WAITING)
        
        // 返回自动下落的结果，包含原始动作信息
        return {
          ...autoDropResult,
          action: `${result.action} → ${autoDropResult.action || '自动下落'}`
        }
      }
      
      if (result.success) {
        this.changeState(GameState.WAITING)
      }
      
      return result
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'AI决策失败'
      this.changeState(GameState.WAITING)
      // AI决策失败时也执行自动下落，保持游戏流程
      return await this.executeAutoDropStep(`AI决策失败(${errorMessage})，自动下落`)
    }
  }

  // 执行具体动作
  private async executeAction(action: GameAction): Promise<StepResult> {
    if (!this.currentPiece) {
      return { success: false, error: '没有当前方块' }
    }

    let newPiece = this.currentPiece
    let newPosition = { ...this.currentPosition }
    let actionDescription = ''

    try {
      switch (action.type) {
        case 'rotate_right':
          // 默认旋转90度，如果指定了角度则使用指定角度
          const rotationDeg = action.parameters?.deg || 90
          newPiece = this.pieceSystem.rotatePiece(this.currentPiece, rotationDeg as RotationDirection)
          actionDescription = `顺时针旋转 ${rotationDeg}度`
          break
          
        case 'left':
          // 默认移动1步，如果指定了步数则使用指定步数
          const leftSteps = action.parameters?.step || 1
          newPosition.x -= leftSteps
          actionDescription = `左移 ${leftSteps}步`
          break
          
        case 'right':
          // 默认移动1步，如果指定了步数则使用指定步数
          const rightSteps = action.parameters?.step || 1
          newPosition.x += rightSteps
          actionDescription = `右移 ${rightSteps}步`
          break
          
        case 'down':
          // 直接下落到底部
          newPosition = this.boardManager.findDropPosition(this.currentPiece, this.currentPosition)
          actionDescription = '直接下落'
          // 确保找到的位置是有效的
          if (!this.boardManager.canPlace(this.currentPiece, newPosition)) {
            console.error('findDropPosition返回了无效位置:', {
              originalPosition: this.currentPosition,
              dropPosition: newPosition,
              piece: this.currentPiece?.shape
            })
            // 如果找到的位置无效，回退到当前位置
            newPosition = { ...this.currentPosition }
          }
          break
          
        default:
          actionDescription = `未知动作类型: ${action.type}`
          break
      }

      // 验证移动是否合法
      if (action.type !== 'down' && !this.boardManager.canPlace(newPiece, newPosition)) {
        // 动作不合法时，忽略动作但继续游戏流程：让方块自动下落一步
        // 重要：不改变当前方块状态，保持原始的currentPiece和currentPosition
        const autoDropDescription = `AI动作不合法(${actionDescription})，自动下落`
        return await this.executeAutoDropStep(autoDropDescription)
      }

      // 更新当前方块状态
      this.currentPiece = newPiece
      this.currentPosition = newPosition

      // 检查方块是否需要放置：
      // 1. 如果是down动作，立即放置
      // 2. 如果动作执行后方块已经着陆，放置方块
      if (action.type === 'down') {
        return await this.placePieceAndContinue(actionDescription)
      } else if (this.boardManager.hasLanded(this.currentPiece, this.currentPosition)) {
        return await this.placePieceAndContinue(actionDescription)
      }

      return { success: true, action: actionDescription }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '执行动作失败'
      // 即使出错也尝试自动下落，保持游戏流程
      return await this.executeAutoDropStep(`执行出错(${errorMessage})，自动下落`)
    }
  }

  // 执行自动下落步骤
  private async executeAutoDropStep(description: string): Promise<StepResult> {
    if (!this.currentPiece) {
      return { success: false, error: '没有当前方块，无法自动下落' }
    }

    // 确保当前位置是有效的
    if (!this.boardManager.canPlace(this.currentPiece, this.currentPosition)) {
      // 如果当前位置都不合法，直接着陆
      return await this.placePieceAndContinue(description + " + 当前位置不合法，立即着陆")
    }

    // 尝试让方块下落一步
    const dropPosition = { x: this.currentPosition.x, y: this.currentPosition.y + 1 }
    
    if (this.boardManager.canPlace(this.currentPiece, dropPosition)) {
      // 可以下落，更新位置
      this.currentPosition = dropPosition
      
      // 检查下落后是否着陆
      if (this.boardManager.hasLanded(this.currentPiece, this.currentPosition)) {
        return await this.placePieceAndContinue(description + " + 着陆")
      }
      
      return { success: true, action: description }
    } else {
      // 无法下落，立即着陆
      return await this.placePieceAndContinue(description + " + 无法下落，着陆")
    }
  }

  // 放置方块并继续游戏
  private async placePieceAndContinue(actionDescription: string): Promise<StepResult> {
    if (!this.currentPiece) {
      return { success: false, error: '没有当前方块' }
    }

    // 放置方块
    const placementResult = this.boardManager.placePiece(this.currentPiece, this.currentPosition)
    
    if (!placementResult.success) {
      return { success: false, error: '无法放置方块' }
    }

    // 更新统计数据
    let newScore = this.state.score
    if (placementResult.linesCleared && placementResult.linesCleared.linesCleared > 0) {
      newScore += placementResult.linesCleared.points
      this.state.score = newScore
      this.state.linesCleared += placementResult.linesCleared.linesCleared
      this.state.level = Math.floor(this.state.linesCleared / 10) + 1
      
      this.callbacks.onLinesCleared?.(placementResult.linesCleared)
      this.callbacks.onScoreUpdate?.(this.state.score, this.state.level)
    }

    // 生成新方块
    const nextPiece = this.pieceSystem.spawnNext()
    
    // 检查游戏是否结束
    if (this.boardManager.isGameOver(nextPiece, { x: 4, y: 0 })) {
      this.endGame()
      return {
        success: true,
        action: actionDescription,
        linesCleared: placementResult.linesCleared,
        newScore,
        gameOver: true
      }
    }

    // 继续游戏
    this.currentPiece = nextPiece
    this.currentPosition = { x: 4, y: 0 }

    return {
      success: true,
      action: actionDescription,
      linesCleared: placementResult.linesCleared,
      newScore
    }
  }

  // 生成新方块
  private spawnNewPiece(): void {
    this.currentPiece = this.pieceSystem.spawnNext()
    this.currentPosition = { x: 4, y: 0 }
  }

  // 结束游戏
  private endGame(): void {
    this.state.isRunning = false
    this.changeState(GameState.GAME_OVER)
    
    if (this.state.startTime) {
      this.state.timeElapsed = Date.now() - this.state.startTime.getTime()
    }
    
    const stats: GameStats = {
      score: this.state.score,
      level: this.state.level,
      linesCleared: this.state.linesCleared,
      timeElapsed: this.state.timeElapsed,
      piecesPlaced: 0 // TODO: 添加计数器
    }
    
    this.callbacks.onGameOver?.(stats)
  }

  // 改变游戏状态
  private changeState(newState: GameState): void {
    this.state.gameState = newState
    this.callbacks.onStateChange?.(newState)
  }

  // 将方块转换为字符串（AI用）
  private pieceToString(piece: PieceInstance): string {
    return piece.shape
      .map(row => row.map(cell => cell ? '×' : '.').join(''))
      .join('\\n')
  }

  // AI相关方法
  setAIPrompt(prompt: string): void {
    this.aiIntegration.setUserPrompt(prompt)
  }

  async validateAIPrompt(): Promise<{ isValid: boolean; errors: string[] }> {
    return await this.aiIntegration.validatePrompt()
  }

  get aiReady(): boolean {
    return this.aiIntegration.isReady
  }

  get aiError(): string | undefined {
    return this.aiIntegration.error
  }

  get aiMode(): string {
    return this.aiIntegration.aiMode
  }

  get aiStatus(): string {
    return this.aiIntegration.aiStatusText
  }

  // 获取当前状态
  get gameState(): GameEngineState {
    if (this.state.startTime && this.state.isRunning) {
      this.state.timeElapsed = Date.now() - this.state.startTime.getTime()
    }
    return { ...this.state }
  }

  get currentBoard() {
    return this.boardManager.grid
  }

  get currentPieceData() {
    return this.currentPiece ? {
      piece: this.currentPiece,
      position: this.currentPosition
    } : null
  }

  get nextPieces() {
    return this.pieceSystem.next
  }
}

export * from './types'