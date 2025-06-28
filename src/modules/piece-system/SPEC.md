# Piece System 模块规格

## 模块职责
管理俄罗斯方块的形状定义、旋转逻辑、移动控制和序列生成。

## ✅ 已实现功能

### 1. 方块形状管理
- ✅ 定义7种标准俄罗斯方块形状（I、O、T、S、Z、J、L）
- ✅ 管理方块的4个旋转状态
- ✅ 提供方块尺寸和形状数据（4x4网格）
- ✅ 统一颜色为白色（#FFFFFF）

### 2. 方块序列生成
- ✅ 生成随机方块序列
- ✅ 维护当前方块和后续3个方块预览
- ✅ 实现标准的7-bag随机算法（Fisher-Yates洗牌）

### 3. 方块控制
- ✅ 处理方块移动（左右移动，支持多步移动）
- ✅ 处理方块旋转（使用RotationDirection枚举：90°、180°、270°）
- ⚠️ 方块位置管理（通过Game Engine统一管理）

### 4. AI数据格式
- ✅ 为AI提供方块的字符串表示格式
- ✅ 符号定义：`×`(方块实体) `.`(空白区域)

## 实际实现接口

```typescript
export class PieceSystem {
  // 当前状态
  private currentPiece: PieceInstance | null = null
  private nextPieces: PieceInstance[] = []
  private bag: PieceType[] = []
  
  // ✅ 已实现的核心方法
  spawnNext(): PieceInstance
  movePiece(piece: PieceInstance, direction: Direction, steps: number): PieceInstance
  rotatePiece(piece: PieceInstance, rotation: RotationDirection): PieceInstance
  reset(): void
  
  // ✅ AI数据转换
  generateAIPieceStrings(): string[]  // 返回3个next pieces的字符串
  
  // ✅ 访问器
  get next(): PieceInstance[]  // 获取后续方块
  get current(): PieceInstance | null  // 获取当前方块
}

// ✅ 实际的类型定义
interface PieceInstance {
  type: PieceType
  shape: boolean[][]  // 4x4网格
  color: string  // 固定为 '#FFFFFF'
  rotationState: number  // 0-3
}

enum PieceType {
  I, O, T, S, Z, J, L
}

enum RotationDirection {
  CW_90 = 90,    // 顺时针90度
  CW_180 = 180,  // 顺时针180度  
  CW_270 = 270   // 顺时针270度
}

enum Direction {
  LEFT, RIGHT, DOWN
}
```

## ❌ 与原SPEC的差异

1. **方块位置管理**: 不由PieceSystem直接管理，而是由Game Engine统一管理
2. **dropPiece方法**: 未实现独立的dropPiece方法，drop逻辑在Board Manager中实现
3. **接口设计**: 实际采用了更灵活的设计，支持方块的不可变操作

## 依赖关系
- **依赖**: 无
- **被依赖**: Board Manager (碰撞检测), Game Engine (控制逻辑), AI Integration (数据转换)

## 数据流
1. ✅ 使用7-bag算法生成新方块并维护预览队列
2. ✅ 响应移动/旋转指令（返回新的方块实例）
3. ⚠️ 验证操作合法性（由Game Engine配合Board Manager完成）
4. ✅ 为AI提供格式化的方块数据

## 实现状态
- **实现完成度**: 95%
- **核心功能**: ✅ 全部实现
- **接口一致性**: ⚠️ 设计有所调整但功能等价