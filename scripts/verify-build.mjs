import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
const root = path.resolve('dist');
const origin = 'https://sakurecat.github.io';
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const files = walk(root);
for (const required of ['index.html', 'blog/index.html', 'blog/hello-robotx/index.html', 'about/index.html', '404.html', 'rss.xml', 'sitemap-index.xml']) assert(fs.existsSync(path.join(root, required)), `Missing output: ${required}`);
assert(!fs.existsSync(path.join(root, 'blog/draft-check')), 'Draft route generated');
let count = 0;
function checkURL(value, base, file) {
  if (!value || /^(data:|mailto:|tel:|javascript:)/i.test(value)) return;
  const url = new URL(value, base);
  if (url.origin !== origin) return;
  let target = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  assert(target === root || target.startsWith(root + path.sep));
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target) && !path.extname(target)) target = path.join(target, 'index.html');
  assert(fs.existsSync(target), `Broken reference: ${value} from ${path.relative(root, file)}`);
  if (url.hash && target.endsWith('.html')) {
    const doc = load(fs.readFileSync(target, 'utf8'));
    assert(doc('[id]').toArray().some(el => doc(el).attr('id') === decodeURIComponent(url.hash.slice(1))), `Missing fragment ${value}`);
  }
  count++;
}
for (const file of files.filter(f => /\.(html|xml)$/.test(f))) {
  const text = fs.readFileSync(file, 'utf8');
  for (const forbidden of ['ROBOTX_DRAFT_SHOULD_NOT_PUBLISH', 'katex-error', 'example.com', '/blog/draft-check']) assert(!text.includes(forbidden), `${forbidden} found in ${file}`);
  if (file.endsWith('.xml')) continue;
  const $ = load(text);
  assert.equal($('html').attr('lang'), 'zh-CN');
  assert.equal($('h1').length, 1);
  assert($('meta[name="description"]').attr('content'));
  assert($('link[rel="canonical"]').attr('href')?.startsWith(origin + '/'));
  const rel = path.relative(root, file).replaceAll(path.sep, '/').replace(/index\.html$/, '');
  const base = new URL('/' + rel, origin);
  $('[href], [src], [srcset]').each((_, el) => {
    const n = $(el);
    if (n.attr('rel') === 'canonical') return;
    for (const attr of ['href', 'src']) checkURL(n.attr(attr), base, file);
    if (n.attr('srcset')) for (const entry of n.attr('srcset').split(',')) checkURL(entry.trim().split(/\s+/)[0], base, file);
  });
  $('img').each((_, img) => assert($(img).attr('alt')?.trim(), `Missing alt: ${file}`));
}
for (const file of files.filter(f => f.endsWith('.css'))) for (const m of fs.readFileSync(file, 'utf8').matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) checkURL(m[1], new URL('/' + path.relative(root, file).replaceAll(path.sep, '/'), origin), file);
const post = load(fs.readFileSync(path.join(root, 'blog/hello-robotx/index.html'), 'utf8'));
assert(post('h1').text().includes('你好，RobotX'));
assert(post('pre.astro-code').length, 'Code highlighting missing');
assert(post('.katex').length >= 2, 'Math missing');
assert(post('.katex-display').length, 'Display math missing');
assert(post('img[src="/images/hello-robotx/example.svg"]').length);
console.log(`Verified ${files.filter(f => f.endsWith('.html')).length} pages and ${count} local references; math, code and draft checks passed.`);
