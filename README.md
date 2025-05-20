# Battery Sales Helper 💝

A sweet little tool I made for my girlfriend in Bangladesh to help her manage her battery sales business. Built with love using Next.js and MongoDB.

## What's Inside? 🎁

- 📊 Sales Tracking
  - Record battery sales
  - Calculate total amounts
  - Keep track of customers

- 💰 Payment Tracking
  - Record customer payments
  - See who paid and who didn't
  - Know your balance

- 📦 Shipment Tracking
  - Record battery deliveries
  - Link with sales
  - Never lose track of orders

- 📈 Reports
  - See your sales summary
  - Check customer history
  - Export data to Excel
  - Filter by date

## Built With 💖

- **Frontend**: Next.js 14
- **UI**: shadcn/ui (because it's pretty!)
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns
- **Export**: xlsx

## Getting Started 🌟

### What You Need

- Node.js 18.0+
- MongoDB

### Let's Set It Up!

1. Get the code
```bash
git clone [repository-url]
cd sales
```

2. Install stuff
```bash
npm install
```

3. Set up your environment
Create `.env.local`:
```env
MONGODB_URI=your-mongodb-uri
```

4. Start it up
```bash
npm run dev
```

5. Open `http://localhost:3000`

## Project Structure 📁

```
sales/
├── app/                    # Main app
│   ├── api/               # Backend stuff
│   ├── statistics/        # Reports page
│   └── page.tsx           # Home sweet home
├── components/            # UI pieces
│   ├── statistics/        # Report components
│   ├── ui/               # Pretty things
│   └── ...
├── lib/                   # Helper functions
│   ├── mongodb.ts        # Database setup
│   └── export-utils.ts   # Excel export
└── public/               # Static files
```

## How to Use 🎯

### Adding New Stuff
1. Add new API routes in `app/api`
2. Create new components in `components`
3. Add helper functions in `lib`

### Exporting Data
Use this to export to Excel:
```typescript
exportToExcel({
  filename: 'my-sales',
  headers: ['Date', 'Customer'],
  data: myData,
  columnKeys: ['date', 'customer']
});
```

---

# 电池销售小助手 💝

这是我为在孟加拉的女朋友做的一个小工具，用来帮她管理电池销售业务。用 Next.js 和 MongoDB 精心打造，充满爱意 ❤️

## 有什么功能？ 🎁

- 📊 销售记录
  - 记录电池销售
  - 计算销售总额
  - 管理客户信息

- 💰 收款记录
  - 记录客户付款
  - 查看收款状态
  - 计算应收余额

- 📦 出货记录
  - 记录电池发货
  - 关联销售订单
  - 追踪发货状态

- 📈 数据统计
  - 查看销售汇总
  - 分析客户数据
  - 导出Excel报表
  - 按日期筛选

## 技术栈 💖

- **前端**: Next.js 14
- **界面**: shadcn/ui (因为好看！)
- **数据库**: MongoDB
- **样式**: Tailwind CSS
- **日期处理**: date-fns
- **导出**: xlsx

## 快速开始 🌟

### 需要准备

- Node.js 18.0+
- MongoDB

### 开始使用

1. 获取代码
```bash
git clone [项目地址]
cd sales
```

2. 安装依赖
```bash
npm install
```

3. 配置环境
创建 `.env.local`:
```env
MONGODB_URI=你的MongoDB地址
```

4. 启动项目
```bash
npm run dev
```

5. 打开 `http://localhost:3000`

## 项目结构 📁

```
sales/
├── app/                    # 主程序
│   ├── api/               # 后端接口
│   ├── statistics/        # 统计页面
│   └── page.tsx           # 主页
├── components/            # 界面组件
│   ├── statistics/        # 统计组件
│   ├── ui/               # 界面元素
│   └── ...
├── lib/                   # 工具函数
│   ├── mongodb.ts        # 数据库配置
│   └── export-utils.ts   # 导出工具
└── public/               # 静态文件
```

## 使用指南 🎯

### 添加新功能
1. 在 `app/api` 添加新接口
2. 在 `components` 添加新组件
3. 在 `lib` 添加新工具

### 导出数据
使用这个函数导出Excel：
```typescript
exportToExcel({
  filename: '销售记录',
  headers: ['日期', '客户'],
  data: 数据,
  columnKeys: ['date', 'customer']
});
```

## 许可证

[MIT License](LICENSE)

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。
