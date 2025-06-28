# Tetris AI Playground

AI Prompt编程挑战平台 - 通过编写提示词来"编程"AI代理，在俄罗斯方块场景中练习AI交互技能。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置AI服务 (可选)

#### 开发环境配置

复制环境变量模板：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入你的OpenRouter API密钥：
```env
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

#### 获取OpenRouter API密钥

1. 访问 [OpenRouter](https://openrouter.ai/keys)
2. 创建账户并获取API密钥
3. 将密钥填入 `.env.local` 文件

#### 可选：使用Cloudflare AI Gateway

如果你想监控和调试AI请求，可以配置Cloudflare AI Gateway：

```env
# 使用Cloudflare AI Gateway (可选)
OPENROUTER_BASE_URL=https://gateway.ai.cloudflare.com/v1/your-account-id/tetris-playground/openrouter
```

详细设置步骤请参考 [Cloudflare AI Gateway设置指南](./docs/CLOUDFLARE_SETUP.md)

> **注意**: 如果没有配置API密钥，系统会自动使用Mock AI模式进行开发。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 开始使用。

## 🎮 功能特色

- **🤖 AI Prompt编程**: 通过自然语言编写AI策略
- **🎯 零代码门槛**: 无需编程基础，只需描述策略
- **⚡ 实时反馈**: 立即看到AI决策效果
- **🎨 高对比度设计**: 简洁的黑白界面
- **🔧 MVP模式**: 单步执行，便于调试和学习

## 🏗️ 项目架构

```
src/
├── modules/           # 核心模块
│   ├── game-engine/   # 游戏引擎
│   ├── board-manager/ # 棋盘管理
│   ├── piece-system/  # 方块系统
│   ├── ai-integration/# AI集成
│   └── ui-components/ # UI组件
├── config/           # 配置文件
└── app/             # Next.js页面
```

## 🔧 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run start    # 启动生产服务器
npm run test     # 运行测试
npm run lint     # 代码检查
```

## 🌍 部署到Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/tetris-playground)

部署时需要设置环境变量：
- `OPENROUTER_API_KEY`: 你的OpenRouter API密钥
- `OPENROUTER_BASE_URL`: AI Gateway URL (可选，用于监控)

## 📝 使用说明

1. **编写策略**: 在左侧编辑器中描述你的AI策略
2. **验证策略**: 点击"验证策略"确保策略有效
3. **开始游戏**: 点击"开始游戏"初始化棋盘
4. **单步执行**: 点击"One Step"观察AI决策过程
5. **观察结果**: 查看AI的行动和游戏状态变化

### 示例策略

```
尽量将方块放置在棋盘中央，避免堆积过高。
优先清除完整行以获得分数，保持棋盘平整。
```

## 🤝 贡献指南

1. Fork 这个仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [OpenRouter](https://openrouter.ai/) - AI API服务
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI集成框架
- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架