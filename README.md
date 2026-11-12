# Littlesongxx · 个人作品集

**线上地址：<https://littlesongxx.github.io>**

一个只用 HTML / CSS / JS 的单页作品集，聚焦 **AI 应用开发** 与 **后端开发**。
页面收录 6 个代表项目 + 6 个更多项目，支持浅色 / 深色主题、项目分类筛选和响应式布局。

## 内容结构

- **代表项目**：GrowthPilot、Smartlect、NewsClaw、MeetingBot、ParingBot、PeerGrab
- **更多项目**：Smartledge、SoulSearcher、PlanGo、Agent_Eval、AI-Medicine-Mall、MindCart
- 只保留 AI 应用、AI + 后端、后端 / 全栈相关项目，不放刷题笔记、机器人或其他方向仓库
- 项目卡片只链接 GitHub 仓库，不依赖已经停机的演示域名
- 项目文案以“这个产品能做什么”为主，技术细节放在标签里，方便非技术读者理解

## 页面特性

- 浅色 / 深色主题（跟随系统，支持手动切换并记住选择）
- 项目分类筛选：全部 / AI 应用 / 后端与全栈
- 首屏数字滚动、滚动进度条、卡片入场和轻量悬浮动效
- 纯静态页面，无框架、无构建步骤、无外部字体或脚本依赖
- `prefers-reduced-motion` 下自动关闭动画

## 目录

```text
.
├── index.html          # 页面结构与全部文案
├── css/style.css       # 主题变量、布局、响应式和动效
├── js/main.js          # 主题切换、筛选、入场动画、数字滚动
├── assets/             # 项目截图（JPG，约 700KB）
├── .nojekyll           # GitHub Pages 不做 Jekyll 处理
└── README.md
```

## 本地预览

```bash
python3 -m http.server 8471
# 打开 http://localhost:8471
```

也可以直接打开 `index.html`，页面没有跨域依赖。

## 修改内容

| 想改什么 | 去哪里 |
| --- | --- |
| 页面标题 / 描述 / OG 信息 | `index.html` 的 `<head>` |
| 首屏文案、统计数字、按钮 | `index.html` 的 `.hero` 区块 |
| 关于我、三条原则、技能标签 | `index.html` 的 `#about` 区块 |
| 代表项目卡片 | `index.html` 的 `#projectGrid` |
| 更多项目卡片 | `index.html` 的 `.more-grid` |
| 主题色、字号、间距 | `css/style.css` 顶部的 `:root` 变量 |
| 主题切换 / 筛选 / 动效 | `js/main.js` |

换项目截图时，建议 16:10 横图、宽 1600px、JPEG 质量 84 左右，并同步修改卡片的 `width` / `height`。

## 部署

仓库 `main` 分支直接作为 GitHub Pages 源站，推送到 `main` 后自动发布：

```bash
git add -A
git commit -m "feat: update portfolio"
git push origin main
```
