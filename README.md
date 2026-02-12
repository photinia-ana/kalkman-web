# Kalkweb - 数据可视化前端

<div align="center">

**跨平台推荐系统的可视化仪表板**

[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-5.0.0-purple.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.3.3-blue.svg)](https://www.typescriptlang.org/)

[English](README_EN.md) | 简体中文

</div>

---

## 🌟 项目简介

Kalkweb 是 Photinia 跨平台推荐系统的可视化前端，提供直观的数据分析和管理界面。

---

## 🎯 核心功能

### 1. 📊 仪表盘
- 系统概览
- 用户统计
- 实时数据监控
- 快速导航

### 2. 👥 用户管理
- 用户列表
- 用户画像详情
- 行为分析
- 兴趣标签可视化

### 3. 🎬 视频资源库
- 视频列表展示
- 个性化推荐预览
- 分类和平台筛选
- 推荐分数可视化
- 视频统计信息

### 4. 🔍 用户对比
- 选择两个用户进行对比
- 相似度分析
- 兴趣重叠可视化
- 行为模式对比

### 5. 📈 数据可视化
- 分类分布图（饼图）
- 时间模式图（柱状图）
- 兴趣标签云
- 情感分析图
- 域名访问排行

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm (推荐) 或 npm

### 安装依赖

```bash
pnpm install
# 或
npm install
```

### 开发模式

```bash
pnpm dev
# 或
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
pnpm build
# 或
npm run build
```

构建产物将在 `dist/` 目录

### 预览生产版本

```bash
pnpm preview
# 或
npm run preview
```

---

## 🏗️ 项目结构

```
kalkman-web/
├── src/
│   ├── pages/                 # 页面组件
│   │   ├── Dashboard.tsx      # 仪表盘
│   │   ├── UserList.tsx       # 用户列表
│   │   ├── UserProfile.tsx    # 用户画像详情
│   │   ├── Compare.tsx        # 用户对比
│   │   └── VideoLibrary.tsx   # 视频资源库
│   ├── components/            # 通用组件
│   │   ├── Layout.tsx         # 布局组件
│   │   └── Card.tsx           # 卡片组件
│   ├── api/                   # API 接口
│   │   └── index.ts           # API 封装
│   ├── types/                 # 类型定义
│   │   └── index.ts
│   ├── App.tsx                # 应用入口
│   ├── main.tsx               # 主文件
│   └── index.css              # 全局样式
├── public/                    # 静态资源
├── index.html                 # HTML 模板
├── vite.config.ts             # Vite 配置
├── tsconfig.json              # TypeScript 配置
└── package.json
```

---

## 🎨 页面说明

### 仪表盘 (`/dashboard`)
系统总览，显示关键指标和快速入口。

**功能：**
- 用户总数
- 视频总数
- 评分总数
- 系统状态

### 用户列表 (`/users`)
展示所有用户及其基本信息。

**功能：**
- 用户列表
- 搜索和筛选
- 快速查看画像
- 跳转到详情页

### 用户画像 (`/profile/:userId`)
详细展示单个用户的画像分析。

**功能：**
- 评分统计
- 分类分布图
- 时间模式分析
- 兴趣标签云
- 情感分析
- 域名访问排行

**可视化组件：**
- 饼图（Recharts PieChart）
- 柱状图（Recharts BarChart）
- 标签云（自定义）

### 用户对比 (`/compare`)
对比两个用户的行为模式和兴趣。

**功能：**
- 选择用户
- 相似度计算
- 兴趣重叠分析
- 行为对比图表

### 视频资源库 (`/videos`)
管理和浏览用户采集的视频资源。

**功能：**
- 两种视图模式：
  - 🎯 为你推荐（个性化推荐）
  - 📚 全部视频（精排列表）
- 分类筛选
- 平台筛选
- 推荐分数展示
- 推荐原因说明
- 视频卡片展示
- 统计信息

**视频卡片信息：**
- 封面图
- 标题
- 作者
- 时长
- 分类标签
- 平台标识
- 推荐分数（颜色编码）
- 推荐原因

---

## 🔧 技术栈

### 核心框架
- **React** 18.2.0 - UI 框架
- **TypeScript** 5.3.3 - 类型安全
- **Vite** 5.0.0 - 构建工具

### 路由
- **React Router** 6.x - 客户端路由

### 数据可视化
- **Recharts** 2.x - 图表库
  - PieChart - 饼图
  - BarChart - 柱状图
  - LineChart - 折线图

### HTTP 客户端
- **Axios** 1.x - API 请求

### 样式
- **CSS Modules** - 样式隔离
- **Inline Styles** - 动态样式

---

## 🌐 API 集成

### API 配置

```typescript
// src/api/index.ts
const api = axios.create({
  baseURL: '/api',  // 通过 Vite 代理到 Kalkman
  timeout: 10000,
})
```

### Vite 代理配置

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8733',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### API 模块

#### 用户画像 API
```typescript
profileApi.getUserProfile(userId)
profileApi.getAllProfiles()
profileApi.getUserInterests(userId, limit)
profileApi.compareUsers(user1, user2)
```

#### 视频资源 API
```typescript
videoApi.getUserVideos(userId, options)
videoApi.getVideoStats(userId)
```

#### 推荐 API
```typescript
recommendationApi.getRecommendations(userId, limit, minScore)
recommendationApi.getSimilarVideos(videoId, userId, limit)
recommendationApi.batchRank(userId, videos)
```

---

## 🎨 设计规范

### 颜色方案

```css
/* 主色调 */
--primary: #2196F3;
--secondary: #FF9800;
--success: #4CAF50;
--warning: #FFC107;
--error: #F44336;

/* 中性色 */
--text-primary: #333;
--text-secondary: #666;
--text-disabled: #999;
--background: #f5f5f5;
--border: #e0e0e0;
```

### 组件样式

- **卡片**: 白色背景，圆角 8px，阴影
- **按钮**: 圆角 4px，悬停效果
- **输入框**: 边框 1px，圆角 4px
- **标签**: 圆角 3px，不同颜色区分类型

### 响应式设计

- **桌面**: > 1200px
- **平板**: 768px - 1200px
- **手机**: < 768px

使用 Grid 和 Flexbox 实现响应式布局。

---

## 📊 数据流

```
用户操作
    ↓
React 组件
    ↓
API 调用 (Axios)
    ↓
Vite 代理 (/api → localhost:8733)
    ↓
Kalkman 后端
    ↓
Supabase 数据库
    ↓
返回数据
    ↓
组件更新
    ↓
UI 渲染
```

---

## 🔍 开发指南

### 添加新页面

1. 在 `src/pages/` 创建组件
2. 在 `src/App.tsx` 添加路由
3. 在 `src/components/Layout.tsx` 添加导航

```typescript
// 1. 创建页面组件
// src/pages/NewPage.tsx
export default function NewPage() {
  return <div>New Page</div>
}

// 2. 添加路由
// src/App.tsx
<Route path="/new" element={<NewPage />} />

// 3. 添加导航
// src/components/Layout.tsx
<Link to="/new">新页面</Link>
```

### 添加新 API

```typescript
// src/api/index.ts
export const newApi = {
  getData: async () => {
    const { data } = await api.get('/new/data')
    return data.data
  }
}
```

### 添加新图表

```typescript
import { PieChart, Pie, Cell } from 'recharts'

const data = [
  { name: 'A', value: 400 },
  { name: 'B', value: 300 }
]

<PieChart width={400} height={400}>
  <Pie data={data} dataKey="value" />
</PieChart>
```

---

## 🧪 测试

```bash
# 运行测试
pnpm test

# 测试覆盖率
pnpm test:coverage
```

---

## 📦 部署

### 构建

```bash
pnpm build
```

### 部署到 Vercel

```bash
vercel --prod
```

### 部署到 Netlify

```bash
netlify deploy --prod --dir=dist
```

### 部署到自己的服务器

```bash
# 构建
pnpm build

# 上传 dist/ 目录到服务器
scp -r dist/* user@server:/var/www/html/

# 配置 Nginx
server {
  listen 80;
  server_name your-domain.com;
  root /var/www/html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  location /api {
    proxy_pass http://localhost:8733;
  }
}
```

---

## 🛣️ 开发路线图

### ✅ 已完成
- [x] 基础布局和导航
- [x] 用户画像可视化
- [x] 视频资源库
- [x] 用户对比功能
- [x] 推荐分数展示

### 🚧 进行中
- [ ] 响应式优化
- [ ] 性能优化
- [ ] 更多图表类型

### 📅 计划中
- [ ] 暗黑模式
- [ ] 国际化（i18n）
- [ ] 实时数据更新（WebSocket）
- [ ] 数据导出功能
- [ ] 高级筛选和搜索
- [ ] 用户设置页面
- [ ] 移动端适配

---

## 🤝 贡献指南

欢迎贡献代码！请查看 [CONTRIBUTING.md](../../CONTRIBUTING.md)

---

## 📄 许可证

MIT License - 详见 [LICENSE](../../LICENSE)

---

## 🙏 致谢

- [React](https://reactjs.org/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Recharts](https://recharts.org/) - 图表库
- [React Router](https://reactrouter.com/) - 路由库

---

<div align="center">

**⭐ 如果觉得有用，请给个 Star！**

Made with ❤️ by [RoyHe roooyhe@163.com]

</div>
