# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

这是一个俄罗斯方块游戏项目，具有AI辅助功能。项目使用TypeScript + Next.js App Router实现，支持用户通过编程Prompt来创建AI操作。

**核心理念**: 这不是传统游戏，而是一个AI Prompt编程挑战平台，用户通过编写提示词来"编程"AI代理，在俄罗斯方块场景中练习AI交互技能。

## 模块化架构

项目采用模块化设计，每个模块都有独立的功能定义和实现：

### 核心模块
- **[Game Engine](./src/modules/game-engine/SPEC.md)** - 游戏核心逻辑和状态管理
- **[Board Manager](./src/modules/board-manager/SPEC.md)** - 棋盘管理和碰撞检测
- **[Piece System](./src/modules/piece-system/SPEC.md)** - 方块形状和移动逻辑
- **[AI Integration](./src/modules/ai-integration/SPEC.md)** - AI决策和Prompt处理
- **[UI Components](./src/modules/ui-components/SPEC.md)** - 界面组件和交互
- **[Storage Manager](./src/modules/storage-manager/SPEC.md)** - 本地数据存储
- **[Input Handler](./src/modules/input-handler/SPEC.md)** - 键盘输入处理

### 模块依赖关系
```
Game Engine (核心协调者)
├── Board Manager (棋盘逻辑)
├── Piece System (方块逻辑)  
├── AI Integration (AI决策)
│   ├── Board Manager (状态数据)
│   └── Piece System (方块数据)
├── Storage Manager (数据持久化)
└── Input Handler (用户输入)

UI Components (界面层)
├── Game Engine (游戏状态)
├── Storage Manager (历史数据)
└── AI Integration (Prompt处理)
```

## 项目功能需求

### 1. 游戏基础功能
- 提供俄罗斯方块游戏，颜色朴素、黑白配色、高对比度风格
- 只有无尽模式一种玩法
- 游戏结束后在浏览器内本地记录：得分、开始时间、游戏耗时数据
- 10x20棋盘
- 预览后续的3个方块

### 2. 操作控制
- 人的操作：加速下落、旋转、左右移动
- WASD键位 = 方向键：
  - W/Up: 旋转
  - S/Down: 直接落到底部
  - A/Left: 左移
  - D/Right: 右移

### 3. 游戏界面
- 预览后续的3个方块
- 10x20棋盘
- 当局得分显示
- 当局进行时间显示

### 4. AI集成功能
- AI只是代替人操作，仍是单人游戏
- AI模块保留接口但不实现具体功能
- 快捷键K触发AI操作一次，AI返回操作指令
- AI模块编程方式：用户编写Prompt，AI根据Prompt和接口生成function
- 游戏开始时生成function并进行单元测试
- function符合输入输出规范后才能作为AI能力使用

## 技术栈

### 框架和语言
- **语言**: TypeScript
- **框架**: Next.js App Router (Vercel兼容性好)
- **AI集成**: https://ai-sdk.dev/providers/community-providers/openrouter#openrouter

### 开发工作流

### 迭代流程
1. **需求变更** → 更新相关模块的SPEC.md
2. **功能定义** → 根据SPEC.md更新代码实现  
3. **验证同步** → 确保SPEC.md与代码一致
4. **更新总览** → 在CLAUDE.md中更新模块引用

### 开发命令
```bash
npm install          # 安装依赖
npm run dev         # 启动开发服务器
npm run build       # 构建生产版本
npm run lint        # 代码检查
npm test           # 运行测试
npm run test:watch  # 监视模式运行测试
```

### Git提交规范

本项目使用详细的Conventional Commits规范，确保提交消息的高质量和一致性。

#### 提交消息结构模板

```
<type>: <简短描述 (50字符内)>

<详细描述，解释what和why>

## <功能分类1>

### 🔧 <子功能描述>
- **模块1**: 具体实现细节和技术要点
- **模块2**: 架构决策和设计思路
- **数据流**: 关键的数据处理逻辑

### 🎮 <子功能描述>
- 具体功能实现
- 用户体验改进
- 性能优化措施

## <功能分类2>
...

### 📁 Project Structure (如有架构变更)
```
新增/修改的目录结构
```

### 🔧 Technical Implementation
- **Framework**: 技术栈说明
- **Architecture**: 架构模式
- **Integration**: 第三方服务集成

### 🎯 Development Methodology (如有工作流变更)
- 开发方法论说明
- 模块化设计理念

## Breaking Changes (如有)
- 重大变更说明

## Migration Guide (如有)
- 迁移步骤说明

## Future Roadmap (可选)
- 后续开发计划

---

<项目特色说明，突出技术亮点和教育价值>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

#### 常用类型标识

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具链相关
- `perf`: 性能优化

#### 高质量提交消息要点

1. **结构化描述**: 使用markdown格式，层次清晰
2. **功能分类**: 用表情符号和分类组织内容
3. **技术细节**: 包含架构决策和实现细节
4. **用户价值**: 说明功能对用户的意义
5. **完整性**: 涵盖所有重要变更
6. **教育性**: 突出学习价值和技术亮点

### 文件结构约定
- 每个模块有独立目录和SPEC.md文档
- 功能定义在SPEC.md中，代码在同目录实现
- TypeScript路径别名: `@/modules/*`, `@/components/*`, `@/types/*`

### AI集成架构

#### 游戏流程

**完整流程:**
1. 开始游戏 → 用户编辑Prompt → 验证Prompt(单元测试) → 提交并进入AI模式 → 游戏结束显示得分 → 本机记录日志

**MVP版本 - 单步运行模式:**
1. **游戏开始**: 渲染初始界面，游戏暂停状态
2. **等待交互**: "One Step"按钮启用，等待用户点击
3. **AI决策**: 用户点击按钮 → 执行AI决策过程 → 获取操作指令
4. **执行动作**: 游戏执行AI返回的动作
5. **渲染结果**: 
   - 更新棋盘状态
   - 如果有消除行为，播放消除动画直到稳定
   - 刷新界面显示
6. **暂停等待**: 游戏再次停下，等待下一次"One Step"点击
7. **循环**: 重复步骤2-6直到游戏结束

#### AI入口函数设计
**输入参数:**
- 当前下落方块位置
- 棋盘当前状态
- 后续3个方块候选

**数据处理:**
- 生成棋盘状态字符串 `{state}`:
  - `+` = 已落稳的方块
  - `×` = 当前正在下落的方块
  - `.` = 空白处(保持视觉美观)
- 生成候选数组 `{next}`: 包含3个字符串，用`×`和`.`表示方块形状

#### AI请求构建
**System Prompt模板:**
```
你是俄罗斯方块的玩家代理，当前的棋盘是:
{state}
后续3个棋是:
{next-join-with-double\n\n}
请根据用户指定的策略输出当前步骤的指令
```

**User Prompt:** 用户编写的策略文本

**Function Tools:**
- `rotate_right(deg: 90|180|270)` - 右旋转
- `down()` - 下移  
- `left(step: 1-20)` - 左移
- `right(step: 1-20)` - 右移

#### 执行循环
1. 发送请求到AI模型
2. AI返回函数名和参数
3. 解析结果并执行动作
4. 刷新游戏状态，渲染界面
5. 继续下一轮AI请求

## 游戏状态管理

### 核心状态
- 当前棋盘状态 (10x20网格)
- 当前下落方块
- 后续3个方块预览
- 得分和游戏时间
- AI生成的操作function
- 游戏运行模式 (暂停/单步/自动)
- One Step按钮状态

### 操作流程
1. 游戏开始 → 生成AI function → 验证 → 开始游戏循环
2. 用户输入/AI指令 → 更新游戏状态 → 渲染界面
3. 游戏结束 → 保存记录到本地存储