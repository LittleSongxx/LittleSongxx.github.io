# Littlesongxx · 个人作品集网站

**线上地址：<https://littlesongxx.github.io>**

纯 HTML / CSS / JS 单页作品集，无框架、无构建步骤，围绕 GitHub 置顶的四个项目（Smartlect、PeerGrab、NewsClaw、MeetingBot）组织内容。

## 目录结构

```
portfolio/
├── index.html      # 全部文案与项目内容
├── css/style.css   # 样式（明亮浅色主题、响应式）
├── js/main.js      # 入场动画 / 移动端菜单 / 导航高亮
└── assets/         # 四个项目的产品截图
```

## 本地预览

```bash
cd portfolio
python -m http.server 8471
# 打开 http://localhost:8471
```

直接双击 index.html 也可以打开（JS 无跨域依赖）。

## 改内容

所有文案都在 `index.html` 里，搜索以下关键词定位：

| 想改什么 | 搜索 |
| --- | --- |
| 名字 / 标题 / 一句话定位 | `hero__name`、`hero__title`、`<title>` |
| 自我介绍三段话 | `about__text` |
| 首页四个统计数字 | `stats` |
| 技能标签分组 | `skill-group` |
| 项目卡片（标题、要点、标签、链接） | `card__body` |
| 换截图 | 替换 `assets/*.jpg`（建议 16:10 横图、宽 1600px 左右） |

**建议尽快补上的**：`contact` 区目前只有 GitHub 入口，把「来 GitHub 找我」按钮换成你的邮箱 `mailto:` 链接，或两个都放。

## 部署到 GitHub Pages（免费）

**方式一：独立站点（推荐）**

1. 新建仓库，名字必须是 `LittleSongxx.github.io`（你的用户名 + .github.io）。
2. 把 `portfolio/` 下的所有文件推到 main 分支（注意：是文件夹内容，不是文件夹本身）：
   ```bash
   cd portfolio
   git init && git add -A && git commit -m "init portfolio"
   git remote add origin https://github.com/LittleSongxx/LittleSongxx.github.io.git
   git push -u origin main
   ```
3. 等一分钟，访问 `https://littlesongxx.github.io`。

**方式二：挂在任意仓库下**

推到任意仓库后：Settings → Pages → Source 选 `main` 分支 `/root`，站点地址为 `https://littlesongxx.github.io/<仓库名>/`。

**自定义域名**（可选）：仓库根目录加 `CNAME` 文件写上域名，DNS 加一条 CNAME 指向 `littlesongxx.github.io`。你有 `peergrab.cn` / `smartlect.cn`，可以考虑买个短域名（如 `edison.cn` 风格）专门做主页。

## 部署后的小优化

- `index.html` 里 `og:image` 目前是相对路径，部署后改成绝对地址（`https://littlesongxx.github.io/assets/smartlect.jpg`），分享到社交平台才有预览图。
- 项目有更新（比如 star 涨了、新功能上线）记得回来同步卡片要点——内容新鲜比样式华丽重要。
- 想加新项目：复制一段 `<article class="card">` 改内容即可，布局会自动排。

## 技术说明

- 浅色主题来自 CSS 变量（`css/style.css` 顶部 `:root`），想换主色调改 `--accent` 一处即可。
- 入场动画用 IntersectionObserver，`prefers-reduced-motion` 下自动禁用。
- 截图已压缩为 1600px JPEG（共约 400KB），首屏无大图阻塞。
