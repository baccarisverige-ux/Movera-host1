import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const src = new URL('../src/', import.meta.url);
const forbidden = [
  'src/pages/',
  'src/features/search-transition/',
  'src/features/map-carousel/',
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

const files = await walk(src);
const violations = [];
for (const file of files) {
  const repoPath = `src/${relative(src.pathname, file).replaceAll('\\', '/')}`;
  for (const legacy of forbidden) {
    if (`${repoPath}/`.startsWith(legacy)) violations.push(`${repoPath}: legacy path`);
  }
  if (!/\.(js|jsx|mjs|css)$/.test(file)) continue;
  const text = await readFile(file, 'utf8');
  for (const legacy of forbidden) {
    const fragment = legacy.replace(/^src\//, '');
    if (text.includes(fragment)) violations.push(`${repoPath}: references ${fragment}`);
  }
}

if (violations.length) {
  console.error('Architecture guard failed:\n' + violations.map(v => `- ${v}`).join('\n'));
  process.exit(1);
}

console.log('Architecture guard passed: no retired Home/Search/Map paths detected.');
