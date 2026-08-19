import { access, readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../', import.meta.url);
const src = new URL('../src/', import.meta.url);
const forbidden = [
  'src/pages/',
  'src/features/search-transition/',
  'src/features/map-carousel/',
  'src/styles/tokens.css',
];
const required = [
  'src/app/router/routes.jsx',
  'src/app/layouts/GuestLayout.jsx',
  'src/app/layouts/HostLayout.jsx',
  'src/features/home/HomePage.jsx',
  'src/features/search/SearchTransitionHost.jsx',
  'src/features/search/searchState.js',
  'src/features/map/MapPage.jsx',
  'src/styles/tokens/index.css',
  'src/styles/tokens/colors.css',
  'src/styles/tokens/typography.css',
  'src/styles/tokens/spacing.css',
  'src/styles/tokens/radius.css',
  'src/styles/tokens/shadows.css',
  'src/styles/tokens/motion.css',
  'src/styles/tokens/z-index.css',
  'src/styles/tokens/breakpoints.css',
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

const violations = [];
for (const requiredPath of required) {
  try {
    await access(new URL(`../${requiredPath}`, import.meta.url));
  } catch {
    violations.push(`${requiredPath}: required architecture file missing`);
  }
}

const files = await walk(src);
for (const file of files) {
  const repoPath = `src/${relative(src.pathname, file).replaceAll('\\', '/')}`;
  for (const legacy of forbidden) {
    if (legacy.endsWith('/') && `${repoPath}/`.startsWith(legacy)) violations.push(`${repoPath}: legacy path`);
    if (!legacy.endsWith('/') && repoPath === legacy) violations.push(`${repoPath}: retired file`);
  }
  if (!/\.(js|jsx|mjs|css)$/.test(file)) continue;
  const text = await readFile(file, 'utf8');
  for (const legacy of forbidden.filter(item => item.endsWith('/'))) {
    const fragment = legacy.replace(/^src\//, '');
    if (text.includes(fragment)) violations.push(`${repoPath}: references ${fragment}`);
  }
}

if (violations.length) {
  console.error('Architecture guard failed:\n' + violations.map(v => `- ${v}`).join('\n'));
  process.exit(1);
}

console.log(`Architecture guard passed: ${required.length} required boundaries present and retired paths absent.`);
