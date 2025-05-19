# MP卡牌定制商城

一个基于 Vue 3 + TypeScript + Element Plus 开发的现代化卡牌定制商城系统。

## 项目特点

- 🚀 基于 Vue 3 + TypeScript + Vite 构建，提供极致的开发体验
- 💪 使用 Element Plus 组件库，提供美观的 UI 界面
- 🌍 支持中英文国际化
- 📱 响应式设计，完美适配移动端
- 🔒 完整的用户认证系统
- 🛒 购物车功能
- 🎨 产品自定义设计功能
- 📦 订单管理系统

## 技术栈

- **前端框架**：Vue 3
- **开发语言**：TypeScript
- **构建工具**：Vite
- **UI 框架**：Element Plus
- **状态管理**：Pinia
- **路由管理**：Vue Router
- **HTTP 客户端**：Axios
- **CSS 预处理器**：SCSS
- **代码规范**：ESLint + Prettier

## 功能特性

### 1. 用户系统
- 用户注册/登录
- 邮箱验证码登录
- 忘记密码/重置密码
- 个人中心
- 用户信息管理

### 2. 产品展示
- 产品分类展示
- 产品详情页
- 产品搜索
- 产品筛选

### 3. 购物车系统
- 添加/删除商品
- 修改商品数量
- 购物车动画效果
- 购物车结算

### 4. 自定义设计
- 产品定制设计
- 设计需求提交
- 设计进度跟踪

### 5. 订单管理
- 订单创建
- 订单状态跟踪
- 订单历史记录
- 订单详情查看

### 6. 其他功能
- 多语言支持
- 响应式布局
- 主题定制
- 动画效果

## 项目结构

```
src/
├── api/                # API 接口
│   ├── modules/       # API 模块
│   └── types.ts       # API 类型定义
├── assets/            # 静态资源
│   ├── images/        # 图片资源
│   └── styles/        # 样式文件
├── components/        # 公共组件
├── layouts/           # 布局组件
├── router/            # 路由配置
├── stores/            # 状态管理
├── utils/             # 工具函数
└── views/             # 页面组件
```

## 开发环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

## 安装和运行

1. 克隆项目
```bash
git clone [项目地址]
cd cursor-vue3-shop2
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 环境配置

项目支持多环境配置：
- 开发环境 (.env.development)
- 测试环境 (.env.test)
- 生产环境 (.env.production)

## 项目规范

### 代码规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 Vue 3 组合式 API 风格指南

### 命名规范
- 组件名：PascalCase
- 文件名：kebab-case
- 变量名：camelCase
- 常量名：UPPER_CASE

### Git 提交规范
- feat: 新功能
- fix: 修复
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

## 部署

1. 构建项目
```bash
npm run build
```

2. 部署 dist 目录到服务器

## 贡献指南

1. Fork 本仓库
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

[MIT License](LICENSE)

## 联系方式

- 电话：020-85163633
- 手机：13316084915
- 邮箱：853369272@qq.com
- 地址：中国广州市增城市新塘太平洋工业区139号511340
