# Game Engine 模块规格

## 模块职责
负责俄罗斯方块游戏的核心逻辑控制，包括游戏状态管理、游戏循环控制和规则执行。

## ✅ 已实现功能

### 1. 游戏状态管理
- ✅ 维护游戏运行状态（WAITING/PROCESSING/ANIMATING/GAME_OVER）
- ✅ 管理得分计算和等级系统
- ✅ 记录游戏时间和统计数据
- ✅ 支持游戏回调事件系统

### 2. 游戏循环控制
- ✅ **MVP模式**: 单步运行，等待"One Step"按钮触发
- ✅ 协调AI决策和游戏动作执行
- ✅ 处理游戏结束条件判断
- ✅ 支持方块落地和消行逻辑

### 3. AI集成管理
- ✅ AI Prompt设置和验证
- ✅ AI决策状态监控
- ✅ AI错误处理和回退机制

## 实际实现接口

```typescript
export class GameEngine {
  // ✅ 游戏状态数据
  private state: GameEngineState
  private currentPiece: PieceInstance | null = null
  private currentPosition: { x: number; y: number } = { x: 4, y: 0 }
  private callbacks: GameCallbacks = {}
  
  // ✅ 已实现的控制方法
  start(): void
  pause(): void
  reset(): void
  async executeStep(): Promise<StepResult>  // MVP: 单步执行
  
  // ✅ AI相关方法
  setAIPrompt(prompt: string): void
  async validateAIPrompt(): Promise<{ isValid: boolean; errors: string[] }>
  
  // ✅ 状态访问器
  get gameState(): GameEngineState
  get currentBoard(): number[][]
  get currentPieceData(): { piece: PieceInstance; position: Position } | null
  get nextPieces(): PieceInstance[]
  get aiReady(): boolean
  get aiError(): string | undefined
  get aiMode(): string
  get aiStatus(): string
}

// ✅ 实际的状态定义
interface GameEngineState {
  gameState: GameState
  score: number
  level: number
  linesCleared: number
  timeElapsed: number
  isRunning: boolean
  startTime?: Date
}

interface StepResult {
  success: boolean
  error?: string
  action?: string
  linesCleared?: { linesCleared: number; points: number; clearedLines: number[] }
  newScore?: number
  gameOver?: boolean
}

interface GameCallbacks {
  onStateChange?: (state: GameState) => void
  onScoreUpdate?: (score: number, level: number) => void
  onLinesCleared?: (result: { linesCleared: number; points: number }) => void
  onGameOver?: (stats: GameStats) => void
}

enum GameState {
  WAITING = 'waiting',      // 等待用户操作
  PROCESSING = 'processing', // AI决策中
  ANIMATING = 'animating',   // 动画播放中（暂未使用）
  GAME_OVER = 'game_over'
}
```

## ❌ 与原SPEC的差异

1. **回调接口不同**: 
   - 原SPEC: `onGameOver: (finalScore: number, duration: number) => void`
   - 实际: `onGameOver: (stats: GameStats) => void` (更详细的统计信息)

2. **executeStep返回值**: 
   - 原SPEC: `Promise<void>`
   - 实际: `Promise<StepResult>` (包含执行结果和错误信息)

3. **新增AI管理功能**: 
   - 增加了AI Prompt管理、验证和状态监控功能
   - 增加了AI错误处理和状态查询方法

4. **方块位置管理**: 
   - Game Engine直接管理当前方块位置，不完全依赖Piece System

## 依赖关系
- **依赖**: Board Manager (棋盘状态), Piece System (方块逻辑), AI Integration (AI决策)
- **被依赖**: UI Components (界面渲染), ❌ Storage Manager (未实现)

## 数据流
1. ✅ 接收用户触发的单步执行请求
2. ✅ 调用AI Integration获取决策指令
3. ✅ 通过Board Manager和Piece System执行游戏动作
4. ✅ 更新游戏状态并通知UI Components渲染
5. ❌ 检查游戏结束条件，如需要则触发存储 (Storage Manager未实现)

## 实现状态
- **实现完成度**: 95%
- **核心功能**: ✅ 全部实现
- **MVP单步执行**: ✅ 完全实现
- **AI集成**: ✅ 超出原规格的完整实现
- **存储功能**: ❌ 依赖未实现的Storage Manager