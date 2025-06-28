# AI Integration 模块规格

## 模块职责
处理AI决策集成，包括用户Prompt处理、AI模型调用、指令解析和验证。

## ✅ 已实现功能

### 1. Prompt处理系统
- ✅ 用户Prompt编辑界面集成
- ✅ Prompt验证（基础校验 + AI评估）
- ❌ Prompt单元测试（未实现）
- ✅ System Prompt模板管理

### 2. AI模型调用
- ✅ 集成ai-sdk.dev(v3.0.0)和OpenRouter
- ✅ 支持Cloudflare AI Gateway
- ✅ 构建AI请求（System + User Prompt + Structured Generation）
- ✅ 处理AI响应和错误管理
- ✅ Mock AI随机决策回退机制

### 3. 指令解析执行
- ✅ 使用Zod Schema进行结构化生成
- ✅ 验证指令参数合法性
- ✅ 转换为游戏操作指令
- ✅ AI决策理由返回

### 4. Function Tools定义
- ✅ `rotate_right(deg: 90|180|270)` - 右旋转
- ✅ `down()` - 下移到底
- ✅ `left(step: 1-20)` - 左移
- ✅ `right(step: 1-20)` - 右移

### 5. 安全架构
- ✅ 服务器端API路由（保护API密钥）
- ✅ 客户端APIClient封装
- ✅ AI状态监控和模式检测

## 实际实现接口

```typescript
// ✅ 客户端 AI Integration 类
export class AIIntegration {
  private userPrompt: string = ''
  private apiClient: APIClient
  
  // ✅ Prompt管理
  setUserPrompt(prompt: string): void
  async validatePrompt(): Promise<ValidationResult>
  
  // ✅ AI决策
  async makeDecision(gameState: AIGameState): Promise<GameAction>
  
  // ✅ 状态访问器
  get isReady(): boolean
  get error(): string | undefined
  get aiMode(): string
  get aiStatusText(): string
  
  reset(): void
}

// ✅ 服务器端API客户端
export class APIClient {
  async validatePrompt(prompt: string): Promise<ValidationResult>
  async makeDecision(gameState: AIGameState, userPrompt: string): Promise<AIResponse>
  async getAIStatus(): Promise<AIStatusResponse>
}

// ✅ 实际的数据结构
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

interface AIResponse {
  action: GameAction
  reasoning?: string
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// ✅ Zod Schema用于结构化生成
const ActionSchema = z.object({
  type: z.enum(['rotate_right', 'down', 'left', 'right']),
  parameters: z.object({
    deg: z.enum([90, 180, 270]).optional(),
    step: z.number().min(1).max(20).optional(),
  }),
  reasoning: z.string().optional(),
})
```

## 实际System Prompt模板

```typescript
// ✅ 在/api/ai/decision/route.ts中实现
const systemPrompt = `你是一个俄罗斯方块AI代理。当前游戏状态：

棋盘状态：
\${gameState.boardState}

当前方块：
\${gameState.currentPiece}

后续3个方块：
\${gameState.nextPieces.join('\\n\\n')}

可用操作：
- rotate_right(deg: 90|180|270): 顺时针旋转
- down(): 直接落到底部
- left(step: 1-20): 向左移动
- right(step: 1-20): 向右移动

请选择最佳操作。`
```

## ❌ 与原SPEC的差异

1. **架构设计差异**: 
   - 原SPEC: 客户端直接调用AI
   - 实际: 服务器端API路由 + 客户端APIClient架构

2. **Function Tools实现**: 
   - 原SPEC: Function Calling方式
   - 实际: Structured Generation + Zod Schema验证

3. **System Prompt格式**: 
   - 原SPEC: `{next-join-with-double\n\n}`
   - 实际: `{gameState.nextPieces.join('\\n\\n')}`

4. **新增功能**: 
   - AI状态监控和模式检测
   - Mock AI回退机制
   - AI决策理由返回
   - Cloudflare AI Gateway支持

## 依赖关系
- **依赖**: 网络 API路由 (/api/ai/*), AI配置 (AI_CONFIG)
- **被依赖**: Game Engine (决策结果)

## 数据流
1. ✅ 收集当前游戏状态数据
2. ✅ 格式化为AI可理解的字符串格式
3. ✅ 通过APIClient发送到服务器端API
4. ✅ 服务器端调用AI模型获取决策
5. ✅ 使用Zod Schema验证返回的操作指令
6. ✅ 返回标准化的游戏动作和理由

## 实现状态
- **实现完成度**: 90%
- **核心功能**: ✅ 全部实现
- **安全架构**: ✅ 完全重设计并实现
- **AI集成**: ✅ 超出原规格的完整实现
- **Prompt单元测试**: ❌ 未实现