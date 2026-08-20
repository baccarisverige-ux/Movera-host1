import { access, readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const src = fileURLToPath(new URL('../src/', import.meta.url));
const forbidden = [
  'src/pages/',
  'src/features/search-transition/',
  'src/features/map-carousel/',
  'src/styles/tokens.css',
  'src/features/account/AccountPages.jsx',
  'src/features/host/HostPages.jsx',
  'src/features/listing-detail/listingDetailData.js',
];
const required = [
  'src/app/router/routes.jsx',
  'src/app/layouts/GuestLayout.jsx',
  'src/app/layouts/HostLayout.jsx',
  'src/features/home/HomePage.jsx',
  'src/features/search/SearchTransitionHost.jsx',
  'src/features/search/searchState.js',
  'src/features/map/MapPage.jsx',
  'src/features/map/constants/map.constants.js',
  'src/features/map-engine/MapContainer.jsx',
  'src/features/map-engine/layers/TileLayer.jsx',
  'src/features/map-engine/layers/MarkerLayer.jsx',
  'src/features/map-engine/layers/ClusterLayer.jsx',
  'src/features/map-engine/controls/MapControls.jsx',
  'src/features/map-engine/lifecycle/ResizeManager.jsx',
  'src/features/map-engine/lifecycle/ViewportController.jsx',
  'src/features/map-engine/geometry/geometry.js',
  'src/features/map-engine/model/markerModel.js',
  'src/features/account/pages/LoginPage.jsx',
  'src/features/account/pages/RegisterPage.jsx',
  'src/features/account/pages/ForgotPasswordPage.jsx',
  'src/features/account/pages/FavoritesPage.jsx',
  'src/features/account/pages/ProfilePage.jsx',
  'src/features/host/dashboard/HostDashboardPage.jsx',
  'src/features/host/listings/HostListingsPage.jsx',
  'src/features/host/listings/HostListingCreatePage.jsx',
  'src/features/host/listings/HostListingEditPage.jsx',
  'src/features/host/reservations/HostReservationsPage.jsx',
  'src/features/host/calendar/HostCalendarPage.jsx',
  'src/features/host/earnings/HostEarningsPage.jsx',
  'src/features/host/settings/HostSettingsPage.jsx',
  'src/features/messages/MessagesPage.jsx',
  'src/features/messages/ThreadPage.jsx',
  'src/entities/listing/listingRepository.js',
  'src/services/storage/storageAdapter.js',
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
  try { await access(new URL(`../${requiredPath}`, import.meta.url)); }
  catch { violations.push(`${requiredPath}: required architecture file missing`); }
}

const files = await walk(src);
for (const file of files) {
  const repoPath = `src/${relative(src, file).replaceAll('\\', '/')}`;
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

  if (/^src\/features\//.test(repoPath) && /(?:\.\.\/)+[^'\"]*features\//.test(text)) {
    violations.push(`${repoPath}: feature-to-feature internal import; use entities/shared/services or a public boundary`);
  }
  if (repoPath.startsWith('src/features/') && text.includes('localStorage.')) {
    violations.push(`${repoPath}: direct localStorage access; use services/storage/storageAdapter.js`);
  }
  if ((repoPath.startsWith('src/entities/') || repoPath.startsWith('src/services/') || repoPath.startsWith('src/shared/')) && text.includes('/features/')) {
    violations.push(`${repoPath}: lower-level layer must not import from features`);
  }
}

if (violations.length) {
  console.error('Architecture guard failed:\n' + violations.map(v => `- ${v}`).join('\n'));
  process.exit(1);
}

console.log(`Architecture guard passed: ${required.length} required boundaries present, retired paths absent, storage centralized, and lower-level layers independent from features.`);
