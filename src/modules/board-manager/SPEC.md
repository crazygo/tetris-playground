# Board Manager 模块规格

## 模块职责
管理10x20俄罗斯方块棋盘，处理方块放置、碰撞检测、消行逻辑和棋盘状态维护。

## 功能定义

### 1. 棋盘状态管理
- 维护10x20网格状态
- 跟踪已放置的方块位置
- 提供棋盘可视化数据

### 2. 碰撞检测
- 检测方块移动和旋转的合法性
- 边界检测和重叠检测
- 支持方块落地检测

### 3. 消行系统
- 检测完整行并执行消除
- 计算消除行数和得分
- 处理消除后的重力下落

### 4. AI数据转换
- 生成AI所需的字符串格式棋盘状态
- 符号定义：`+`(已落稳) `×`(当前下落) `.`(空白)

## 核心接口

```typescript
interface BoardManager {
  // 棋盘数据
  readonly grid: CellState[][]  // 10x20网格
  readonly width: 10
  readonly height: 20
  
  // 操作方法
  canPlace(piece: Piece, position: Position): boolean
  placePiece(piece: Piece, position: Position): void
  clearLines(): { linesCleared: number, points: number }
  
  // AI数据转换
  generateAIState(currentPiece: Piece, position: Position): string
  
  // 查询方法
  isLineFull(row: number): boolean
  getTopFilledRow(): number
  isEmpty(): boolean
}

enum CellState {
  EMPTY = 0,
  FILLED = 1
}
```

## 依赖关系
- **依赖**: Piece System (方块数据结构)
- **被依赖**: Game Engine (状态查询), AI Integration (数据转换)

## 数据流
1. 接收方块放置请求
2. 执行碰撞检测验证
3. 更新棋盘状态
4. 检测并处理消行
5. 返回操作结果和得分信息