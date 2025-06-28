# Game Engine 模块规格

## 模块职责
负责俄罗斯方块游戏的核心逻辑控制，包括游戏状态管理、游戏循环控制和规则执行。

## 功能定义

### 1. 游戏状态管理
- 维护游戏运行状态（暂停/单步/自动/结束）
- 管理得分计算和等级系统
- 记录游戏时间和统计数据

### 2. 游戏循环控制
- **MVP模式**: 单步运行，等待"One Step"按钮触发
- 协调AI决策和游戏动作执行
- 处理游戏结束条件判断

### 3. 核心接口

```typescript
interface GameEngine {
  // 游戏状态
  readonly state: GameState
  readonly score: number
  readonly level: number
  readonly timeElapsed: number
  
  // 控制方法
  start(): void
  pause(): void
  reset(): void
  executeStep(): Promise<void>  // MVP: 单步执行
  
  // 事件回调
  onGameOver: (finalScore: number, duration: number) => void
  onScoreUpdate: (score: number) => void
}

enum GameState {
  WAITING = 'waiting',    // 等待用户操作
  PROCESSING = 'processing', // AI决策中
  ANIMATING = 'animating',   // 动画播放中
  GAME_OVER = 'game_over'
}
```

## 依赖关系
- **依赖**: Board Manager (棋盘状态), Piece System (方块逻辑), AI Integration (AI决策)
- **被依赖**: UI Components (界面渲染), Storage Manager (数据存储)

## 数据流
1. 接收用户触发的单步执行请求
2. 调用AI Integration获取决策指令
3. 通过Board Manager和Piece System执行游戏动作
4. 更新游戏状态并通知UI Components渲染
5. 检查游戏结束条件，如需要则触发存储