# AI Integration 模块规格

## 模块职责
处理AI决策集成，包括用户Prompt处理、AI模型调用、指令解析和验证。

## 功能定义

### 1. Prompt处理系统
- 用户Prompt编辑界面集成
- Prompt验证和单元测试
- System Prompt模板管理

### 2. AI模型调用
- 集成ai-sdk.dev和OpenRouter
- 构建AI请求（System + User Prompt + Function Tools）
- 处理AI响应和错误管理

### 3. 指令解析执行
- 解析AI返回的function call
- 验证指令参数合法性
- 转换为游戏操作指令

### 4. Function Tools定义
- `rotate_right(deg: 90|180|270)` - 右旋转
- `down()` - 下移到底
- `left(step: 1-20)` - 左移
- `right(step: 1-20)` - 右移

## 核心接口

```typescript
interface AIIntegration {
  // Prompt管理
  setUserPrompt(prompt: string): void
  validatePrompt(): Promise<ValidationResult>
  
  // AI决策
  makeDecision(gameState: AIGameState): Promise<GameAction>
  
  // 状态数据
  isReady: boolean
  lastError?: string
}

interface AIGameState {
  boardState: string      // 棋盘字符串表示
  currentPiece: string    // 当前方块位置
  nextPieces: string[]    // 后续3个方块
}

interface GameAction {
  type: 'rotate_right' | 'down' | 'left' | 'right'
  parameters: {
    deg?: 90 | 180 | 270
    step?: number
  }
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
}
```

## System Prompt模板

```
你是俄罗斯方块的玩家代理，当前的棋盘是:
{state}
后续3个棋是:
{next-join-with-double\n\n}
请根据用户指定的策略输出当前步骤的指令
```

## 依赖关系
- **依赖**: Board Manager (状态数据), Piece System (方块数据)
- **被依赖**: Game Engine (决策结果)

## 数据流
1. 收集当前游戏状态数据
2. 格式化为AI可理解的字符串格式
3. 构建完整的AI请求
4. 调用AI模型获取决策
5. 解析并验证返回的操作指令
6. 返回标准化的游戏动作