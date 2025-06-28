# UI Components 模块规格

## 模块职责
提供游戏界面的所有React组件，实现黑白高对比度设计风格和用户交互功能。

## 功能定义

### 1. 游戏界面组件
- **GameBoard**: 10x20棋盘渲染，显示已放置和正在下落的方块
- **NextPieces**: 预览后续3个方块
- **ScoreDisplay**: 显示当前得分
- **TimeDisplay**: 显示游戏进行时间
- **ControlPanel**: One Step按钮和游戏控制

### 2. AI编辑界面
- **PromptEditor**: 用户Prompt编辑器
- **ValidationStatus**: Prompt验证状态显示
- **TestResults**: 单元测试结果展示

### 3. 游戏记录界面
- **GameHistory**: 历史游戏记录列表
- **ScoreCard**: 游戏结束得分卡片

### 4. 设计风格
- 黑白配色，高对比度
- 朴素、简洁的视觉风格
- 响应式布局

## 核心接口

```typescript
interface GameBoardProps {
  grid: CellState[][]
  currentPiece?: Piece
  currentPosition?: Position
  className?: string
}

interface NextPiecesProps {
  pieces: Piece[3]
  className?: string
}

interface ControlPanelProps {
  gameState: GameState
  onStepClick: () => void
  onResetClick: () => void
  isProcessing: boolean
}

interface PromptEditorProps {
  value: string
  onChange: (value: string) => void
  onValidate: () => void
  validationResult?: ValidationResult
}
```

## 组件层次结构

```
GamePage
├── PromptEditor (AI配置区域)
├── GameContainer
│   ├── GameBoard (主棋盘)
│   ├── NextPieces (预览区)
│   ├── ScoreDisplay (得分)
│   ├── TimeDisplay (时间)
│   └── ControlPanel (控制按钮)
└── GameHistory (历史记录)
```

## 依赖关系
- **依赖**: Game Engine (游戏状态), Storage Manager (历史数据), AI Integration (Prompt处理)
- **被依赖**: 无

## 样式规范
- 主背景: 黑色 (#000000)
- 前景文字: 白色 (#FFFFFF)
- 方块边框: 白色细线
- 强调元素: 白色粗体
- 按钮: 黑底白字，hover时反转
- 字体: 等宽字体优先，确保对齐