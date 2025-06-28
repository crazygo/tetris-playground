# Input Handler 模块规格

## 模块职责
处理键盘输入事件，将用户操作转换为游戏指令，支持WASD和方向键映射。

## ❌ 实现状态: 完全未实现

### 1. 键盘映射
- ❌ **W/Up**: 旋转方块
- ❌ **S/Down**: 直接落到底部
- ❌ **A/Left**: 左移方块
- ❌ **D/Right**: 右移方块
- ❌ **K**: 触发AI单步操作（MVP版本中替代为One Step按钮）

### 2. 输入处理
- ❌ 键盘事件监听和管理
- ❌ 防止重复触发和按键冲突
- ❌ 输入状态管理（启用/禁用）

### 3. 游戏状态感知
- ❌ 根据游戏状态启用/禁用特定按键
- ❌ 在AI处理期间禁用人工输入
- ❌ 处理游戏暂停状态

## 核心接口

```typescript
interface InputHandler {
  // 控制方法
  enable(): void
  disable(): void
  isEnabled: boolean
  
  // 事件绑定
  onRotate: () => void
  onDrop: () => void
  onMoveLeft: () => void
  onMoveRight: () => void
  onAIStep: () => void  // MVP: K键触发AI
  
  // 状态管理
  setGameState(state: GameState): void
}

interface KeyMapping {
  [key: string]: InputAction
}

enum InputAction {
  ROTATE = 'rotate',
  DROP = 'drop',
  MOVE_LEFT = 'move_left',
  MOVE_RIGHT = 'move_right',
  AI_STEP = 'ai_step'
}
```

## 键位配置

```typescript
const DEFAULT_KEY_MAPPING: KeyMapping = {
  'KeyW': InputAction.ROTATE,
  'ArrowUp': InputAction.ROTATE,
  'KeyS': InputAction.DROP,
  'ArrowDown': InputAction.DROP,
  'KeyA': InputAction.MOVE_LEFT,
  'ArrowLeft': InputAction.MOVE_LEFT,
  'KeyD': InputAction.MOVE_RIGHT,
  'ArrowRight': InputAction.MOVE_RIGHT,
  'KeyK': InputAction.AI_STEP
}
```

## 影响范围

### 缺失该模块导致的功能缺失:
- ❌ 无法使用键盘操控游戏
- ❌ 无WASD/方向键快捷键支持
- ❌ 用户体验不完整（只能鼠标操作）
- ❌ 无法快速调试AI策略

### 当前替代方案:
- ✅ 使用UI按钮进行游戏控制
- ✅ One Step按钮替代K键触发AI
- ✅ 基本游戏功能不受影响

## 依赖关系
- **依赖**: 无
- **被依赖**: ❌ Game Engine (输入事件缺失), ❌ UI Components (用户体验不完整)

## 实现优先级
- **优先级**: 低等
- **原因**: MVP版本主要依赖AI决策，键盘输入非必需
- **建议**: 可以在后续版本中添加，提升用户体验
- **替代方案**: 继续使用UI按钮控制

## 实现状态
- **实现完成度**: 0%
- **代码文件**: 无相关实现文件
- **SPEC状态**: 设计完整，但非核心功能
- **影响程度**: 轻微（基本功能可通过UI实现）