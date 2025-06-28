# Input Handler 模块规格

## 模块职责
处理键盘输入事件，将用户操作转换为游戏指令，支持WASD和方向键映射。

## 功能定义

### 1. 键盘映射
- **W/Up**: 旋转方块
- **S/Down**: 直接落到底部
- **A/Left**: 左移方块
- **D/Right**: 右移方块
- **K**: 触发AI单步操作（MVP版本中替代为One Step按钮）

### 2. 输入处理
- 键盘事件监听和管理
- 防止重复触发和按键冲突
- 输入状态管理（启用/禁用）

### 3. 游戏状态感知
- 根据游戏状态启用/禁用特定按键
- 在AI处理期间禁用人工输入
- 处理游戏暂停状态

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

## 依赖关系
- **依赖**: 无
- **被依赖**: Game Engine (输入事件), UI Components (状态显示)

## 状态管理
- **WAITING状态**: 禁用所有游戏输入，仅允许AI触发
- **PROCESSING状态**: 禁用所有输入
- **ANIMATING状态**: 禁用所有输入
- **GAME_OVER状态**: 禁用游戏输入，允许重置操作

## 事件流
1. 监听全局键盘事件
2. 根据当前游戏状态过滤输入
3. 映射按键到游戏动作
4. 触发对应的回调函数
5. 记录输入历史（调试用）