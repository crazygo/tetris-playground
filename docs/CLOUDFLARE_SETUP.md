# Cloudflare AI Gateway 设置指南

使用Cloudflare AI Gateway可以监控、缓存和调试OpenRouter API请求。

## 1. 创建AI Gateway

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 在左侧菜单选择 **AI** → **AI Gateway**
3. 点击 **Create Gateway**
4. 填写网关信息：
   - **Gateway Name**: `tetris-playground`
   - **Gateway Slug**: `tetris-playground` (自动生成)
5. 点击 **Create Gateway**

## 2. 获取Gateway URL

创建成功后，你会得到一个Gateway URL，格式如下：
```
https://gateway.ai.cloudflare.com/v1/{account-id}/tetris-playground/openrouter
```

其中：
- `{account-id}` 是你的Cloudflare账户ID
- `tetris-playground` 是Gateway名称
- `openrouter` 是上游提供商

## 3. 配置环境变量

在你的 `.env.local` 文件中设置：

```env
# 使用Cloudflare AI Gateway
OPENROUTER_BASE_URL=https://gateway.ai.cloudflare.com/v1/your-account-id/tetris-playground/openrouter

# 你的OpenRouter API密钥
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here

# 其他可选配置
OPENROUTER_MODEL=microsoft/wizardlm-2-8x22b
OPENROUTER_MAX_TOKENS=1000
OPENROUTER_TEMPERATURE=0.7
```

## 4. 验证配置

启动开发服务器后，检查控制台输出：

```bash
npm run dev
```

你应该看到：
```
🔧 AI配置信息: {
  baseURL: "https://gateway.ai.cloudflare.com/v1/...",
  model: "microsoft/wizardlm-2-8x22b",
  apiKey: "sk-or-v1..."
}
✅ OpenRouter客户端已配置
🚀 使用OpenRouter AI模式
```

## 5. 监控和调试

在Cloudflare Dashboard中：

1. 进入 **AI** → **AI Gateway** → **tetris-playground**
2. 查看实时请求日志
3. 监控请求量、延迟、错误率
4. 查看请求和响应内容
5. 设置缓存和速率限制

## 6. 常见问题

### Q: 请求失败，显示403错误
A: 检查Account ID是否正确，确保Gateway已启用

### Q: 看不到请求日志
A: 确保baseURL格式正确，包含正确的account-id和gateway名称

### Q: 如何切换回直连模式？
A: 在`.env.local`中删除或注释`OPENROUTER_BASE_URL`行

## 7. Gateway优势

- **监控**: 实时查看所有AI请求
- **缓存**: 减少重复请求，节省成本
- **限制**: 设置速率限制和预算控制
- **调试**: 详细的请求/响应日志
- **分析**: 使用统计和性能指标