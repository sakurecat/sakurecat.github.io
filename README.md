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

### 在 Ubuntu 的 VS Code 中写作

首次打开：`code RobotX.code-workspace`，或在 VS Code 的“文件 → 从文件打开工作区”选择此文件。确认信任自己的项目后即可使用任务。工作区已配置 UTF-8、自动保存、Markdown 自动换行、代码片段和资源目录隐藏；文件仍保留在磁盘上。

按 **Ctrl+Shift+P**，输入“运行任务”（Tasks: Run Task），选择以“博客：”开头的任务：

| 任务 | 用途 |
| --- | --- |
| 新建文章 | 输入英文文件名和中文标题，生成带日期的草稿，并尝试自动打开 |
| 启动预览 | 在后台运行博客，点击输出的本地地址 |
| 停止预览 / 预览状态 / 预览日志 | 管理后台预览进程 |
| 发布前检查 | 依次检查代码、构建、验证资源；快捷键 **Ctrl+Shift+B** |
| 安装依赖 | 首次配置或更新锁文件后运行 |

这些任务适用于 Ubuntu Bash，会自动加载已有 nvm 并选择 `.nvmrc` 中的版本，不需要每次手动执行 `nvm use`。Windows 继续使用下文的 npm 命令。任务只对本次进程关闭 Astro 遥测。

日常操作：

1. 开始前在源代码管理中检查工作区，干净时从“…”菜单选择“拉取”，同步另一台电脑的内容。
2. 运行“博客：新建文章”，编辑 `src/content/blog/` 中的 Markdown。填写摘要与正文，图片放到 `public/images/文章文件名/`。
3. 按 **Ctrl+K，然后 V** 打开侧边 Markdown 预览。输入 `blogimg`、`blogcode` 或 `blogmath` 后按 Tab 插入图片、代码块或公式；按 Tab 跳到下一处填写位置。
4. 查看实际博客效果时将文章的 `draft` 改为 `false`，运行“博客：启动预览”，打开 `/blog/文章文件名/`。侧边 Markdown 预览不等同于网站最终效果。
5. 发布前保存文件，按 **Ctrl+Shift+B**，确认三项检查全部通过。
6. 按 **Ctrl+Shift+G** 打开源代码管理，逐个查看差异，点击要上传的文章和图片旁的 **+** 暂存，输入提交说明，然后点击“提交”。首次保存本套配置时，也暂存 `.vscode/`、`scripts/vscode-blog.sh`、`RobotX.code-workspace` 和 `README.md`。
7. 从源代码管理的“…”菜单选择“推送”。首次需要授权时，在 VS Code 提示打开的 GitHub 页面登录 **sakurecat** 并授权；不需要把密码或 token 写进项目。若推送被拒绝，按本文同步与故障处理说明解决，避免强推。
8. 在 [GitHub Actions](https://github.com/sakurecat/sakurecat.github.io/actions) 确认该提交构建与部署成功，再打开线上文章。

在 VS Code 中插入图片：把光标放到 Markdown 正文，粘贴截图，或将图片拖到编辑区并按住 Shift 放下。外部图片自动保存到 `src/assets/文章文件名/`，生成相对路径，可同时用于侧边预览和 Astro 网站。已经在项目里的图片可用命令“Markdown: Insert Image from Workspace”选择，优先选 `src/assets/` 中的文件；补上方括号中的图片说明。发布时将这些图片与文章一起暂存。原有 `public/images/` 的 `/images/...` 写法仍适用于网站，但 VS Code 内置预览不会把 public 作为网站根目录。

VS Code 内置 Git 和 GitHub 身份验证，无需先安装 `gh`。本工作区已提供 Astro 与 MDX 扩展推荐，可在扩展面板搜索 `@recommended` 安装；普通 Markdown 编辑、预览、任务和提交不依赖这些扩展。当前配置不会替你登录或推送，首次推送仍需在本机确认账号授权。自动保存不等于提交，`draft: true` 的源码在公开仓库中同样可见。

配置参考：[VS Code 任务](https://code.visualstudio.com/docs/debugtest/tasks)、[源代码管理](https://code.visualstudio.com/docs/sourcecontrol/overview)。

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

## 当前 Windows 环境说明

本机 Git 需要使用系统已启用的代理，已为这个 clone 单独设置 `http://127.0.0.1:7897`。如果关闭代理或换了端口，请同步调整此仓库的 Git 配置；不影响其他仓库。第二个系统的 clone 不会继承这个本地设置。

```sh
git config --local --get http.proxy
# 不再需要代理时：
git config --local --unset http.proxy
```

npm 缓存在项目内的 `.npm-cache`，已被 Git 忽略，避免依赖系统盘上不可写的全局缓存。KaTeX 的间接依赖通过 overrides 统一为直接依赖版本，防止公式插件带入旧版；更新后必须重新检查公式。
