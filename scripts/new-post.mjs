import fs from 'node:fs';
import path from 'node:path';
const [slug, title = '新的技术笔记'] = process.argv.slice(2);
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('用法：npm run new-post -- my-note "文章标题"（文件名使用小写英文与连字符）');
  process.exit(1);
}
const target = path.join('src/content/blog', slug + '.md');
const content = ['---', 'title: ' + JSON.stringify(title), 'description: "请填写文章摘要。"', 'pubDate: ' + JSON.stringify(new Date().toISOString()), 'draft: true', 'tags: ["技术笔记"]', '---', '', '## 问题', '', '## 实践', '', '## 收获', ''].join('\n');
try {
  fs.writeFileSync(target, content, { flag: 'wx' });
  console.log('已创建草稿：' + target + '\n预览或发布时将 draft 改为 false。私密草稿不要提交到公开仓库。');
} catch (error) {
  console.error(error.code === 'EEXIST' ? '同名文章已存在，未覆盖。' : error.message);
  process.exit(1);
}
