# Piece System 模块规格

## 模块职责
管理俄罗斯方块的形状定义、旋转逻辑、移动控制和序列生成。

## 功能定义

### 1. 方块形状管理
- 定义7种标准俄罗斯方块形状（I、O、T、S、Z、J、L）
- 管理方块的4个旋转状态
- 提供方块尺寸和形状数据

### 2. 方块序列生成
- 生成随机方块序列
- 维护当前方块和后续3个方块预览
- 实现标准的7-bag随机算法

### 3. 方块控制
- 处理方块移动（左右、下落）
- 处理方块旋转（90°、180°、270°）
- 管理方块当前位置和状态

### 4. AI数据格式
- 为AI提供方块的字符串表示格式
- 符号定义：`×`(方块实体) `.`(空白区域)

## 核心接口

```typescript
interface PieceSystem {
  // 当前状态
  readonly currentPiece: Piece
  readonly currentPosition: Position
  readonly nextPieces: Piece[3]
  
  // 控制方法
  spawnNext(): Piece
  movePiece(direction: Direction, steps?: number): boolean
  rotatePiece(degrees: 90 | 180 | 270): boolean
  dropPiece(): Position  // 直接落到底部
  
  // AI数据转换
  generateAIPieceStrings(): string[]  // 返回3个next pieces的字符串
}

interface Piece {
  type: PieceType
  shape: boolean[][]  // 4x4网格
  color: string
  rotation: number
}

enum PieceType {
  I, O, T, S, Z, J, L
}

enum Direction {
  LEFT, RIGHT, DOWN
}
```

## 依赖关系
- **依赖**: 无
- **被依赖**: Board Manager (碰撞检测), Game Engine (控制逻辑), AI Integration (数据转换)

## 数据流
1. 生成新方块并维护预览队列
2. 响应移动/旋转指令
3. 验证操作合法性（配合Board Manager）
4. 更新方块位置和状态
5. 为AI提供格式化的方块数据