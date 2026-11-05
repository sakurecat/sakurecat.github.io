# RobotX · 技术与实践

个人技术博客，来自 [Astro 官方 blog starter](https://github.com/withastro/astro/tree/main/examples/blog)。

- 网站：https://sakurecat.github.io
- GitHub：sakurecat/sakurecat.github.io（品牌名仍为 RobotX）
- Node 24.13.0、npm 11.6.2；Node 精确版本在 .nvmrc 中。
- Markdown / MDX、KaTeX、Shiki、响应式明暗主题、RSS、sitemap。

## 安装与预览

Ubuntu 和 Windows 分别 clone 到自己的文件系统，不能共用工作目录或 node_modules。

```sh
git clone https://github.com/sakurecat/sakurecat.github.io.git
cd sakurecat.github.io
node --version
npm ci
npm run dev
```

打开终端显示的本地地址。Windows 如果拒绝 npm.ps1，使用 npm.cmd 替代 npm，不必修改系统安全设置。Ubuntu nvm 用户进入目录后运行 nvm install 和 nvm use；Windows 使用相同版本的安装包或版本管理器。

## 创建文章

开始前先检查、同步；有未整理改动时不要直接 pull：

```sh
git status
git pull --ff-only origin main
npm run new-post -- my-first-note "我的第一篇技术笔记"
```

编辑 src/content/blog/my-first-note.md，填写摘要、真实日期与正文。draft: true 不生成页面，也不进入列表、RSS 或 sitemap；预览正文时临时改为 false，发布时保持 false。私密草稿不要提交到公开仓库，draft 不是访问控制。

必填 title、description、pubDate；可填 updatedDate、tags、draft。日期使用带时区的 ISO 字符串，如 2026-11-05T12:00:00+08:00。页面日期按中国标准时间显示。未来日期不会自动延迟发布。

文件名使用小写英文与连字符，是永久链接的一部分，不随意改动。支持 $E = mc^2$ 行内公式，独立 $$ 公式块，以及标注语言的代码围栏。

图片放在 public/images/my-first-note/，例如：

```markdown
![图片说明](/images/my-first-note/example.webp)
```

引用不带 public，大小写精确一致；图片与文章一起提交。可选 heroImage 填相对文章的 src/assets 图片路径，同时填写 heroAlt。

## 检查与发布

```sh
npm run check
npm run build
npm run verify
npm run preview
```

预览后结束服务器，再提交指定文件（没有图片则省略对应 git add）：

```sh
git diff --check
git add src/content/blog/my-first-note.md
git add public/images/my-first-note
git diff --cached
git commit -m "post: add my first note"
git push origin main
```

仓库 Actions 页面显示构建和部署结果；确认本次提交成功后打开文章。verify 会检查站内链接、图片字体文件、公式、代码高亮、元信息及草稿过滤。

## 双系统同步

切换前 commit + push，切换后先 pull。锁文件变化时 npm ci，两边各自安装依赖与登录 GitHub。仓库级配置：

```sh
git config user.name "RobotX"
git config user.email "181215614+sakurecat@users.noreply.github.com"
git config pull.ff only
git config core.autocrlf false
```

此 noreply 地址由 GitHub 返回的账户 ID 与登录名组成，保护个人邮箱；可在 GitHub 邮箱设置中核对你的提交偏好。

若提交分叉，先保证工作区干净，再 git fetch origin、git log --oneline --graph --all 查看差异，之后 git rebase origin/main。逐个解决冲突，git add 后 git rebase --continue；不确定则 git rebase --abort。禁止强推覆盖另一系统的内容。

## 部署与安全

Settings → Pages → Source 选择 GitHub Actions。site 为 https://sakurecat.github.io，不设置仓库 base。无需 CNAME、个人部署 token 或 gh-pages 分支。只有 main 的 deploy job 获得 Pages 写权限，PR 仅构建检查。

提交源码、图片、package-lock.json，不提交 dist、.astro、node_modules、.env。检查截图和文章中是否有秘密；泄露凭据后先撤销/轮换。MDX 是可信作者代码，不直接运行陌生人的投稿。依赖更新独立提交并重新验证，不盲目 npm audit fix --force。

## 常见故障

- Windows 正常但线上图片 404：检查文件已提交、大小写和 public 前缀。
- npm ci 锁文件不一致：核对 package.json，本地 npm install 更新并提交锁文件。
- 公式未渲染：检查 Astro 7 unified 配置；显示异常检查 KaTeX CSS 与字体。
- 文章未更新：检查 draft、部署 commit 与缓存。
- 恢复错误发布：工作区干净时 git revert <问题提交SHA>，检查后 push，不改写历史。

本期只有博客创建和发文，不包含评论、数据库、社区同步或任务管理。
