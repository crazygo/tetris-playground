# Storage Manager 模块规格

## 模块职责
管理游戏数据的本地存储，包括游戏记录、用户Prompt和配置数据的持久化。

## 功能定义

### 1. 游戏记录存储
- 保存游戏得分、开始时间、游戏耗时
- 维护历史游戏记录列表
- 支持记录查询和统计

### 2. 用户数据存储
- 保存用户的AI Prompt
- 存储验证通过的Prompt历史
- 缓存游戏配置和偏好设置

### 3. 数据管理
- 本地localStorage操作封装
- 数据序列化和反序列化
- 存储容量管理和清理策略

## 核心接口

```typescript
interface StorageManager {
  // 游戏记录
  saveGameRecord(record: GameRecord): void
  getGameHistory(): GameRecord[]
  getBestScore(): number
  getTotalGamesPlayed(): number
  
  // Prompt管理
  saveUserPrompt(prompt: string): void
  getUserPrompt(): string | null
  savePromptHistory(prompt: string): void
  getPromptHistory(): string[]
  
  // 配置管理
  saveConfig(config: GameConfig): void
  getConfig(): GameConfig
  
  // 数据管理
  clearHistory(): void
  getStorageUsage(): number
}

interface GameRecord {
  id: string
  score: number
  startTime: Date
  duration: number  // 毫秒
  prompt: string
  endReason: 'completed' | 'game_over'
  createdAt: Date
}

interface GameConfig {
  soundEnabled: boolean
  animationSpeed: number
  theme: 'dark' | 'light'
}
```

## 存储结构

```typescript
// localStorage keys
const STORAGE_KEYS = {
  GAME_HISTORY: 'tetris_game_history',
  USER_PROMPT: 'tetris_user_prompt',
  PROMPT_HISTORY: 'tetris_prompt_history',
  GAME_CONFIG: 'tetris_config'
}
```

## 依赖关系
- **依赖**: 无
- **被依赖**: Game Engine (记录保存), UI Components (历史显示), AI Integration (Prompt存储)

## 数据流
1. 游戏结束时接收记录数据
2. 序列化并存储到localStorage
3. 响应历史数据查询请求
4. 提供数据统计和分析功能
5. 管理存储空间和数据清理