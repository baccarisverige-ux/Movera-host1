import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')
const listFiles = (dir) => fs.existsSync(path.join(root, dir)) ? fs.readdirSync(path.join(root, dir)) : []

const app = read('src/app/App.jsx')
const searchDir = 'src/features/search'
const searchFiles = listFiles(searchDir).sort()
const workflowFiles = listFiles('.github/workflows').filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))

const expectedSearchFiles = [
  'GuestSelector.jsx',
  'SearchCalendar.jsx',
  'SearchTransitionHost.jsx',
  'searchData.js',
  'searchState.js',
  'searchTransition-stability.css',
  'searchTransition.css',
].sort()

const unexpectedSearchFiles = searchFiles.filter((file) => !expectedSearchFiles.includes(file))
const missingSearchFiles = expectedSearchFiles.filter((file) => !searchFiles.includes(file))
const searchImplementations = searchFiles.filter((f) => /Search.*\.jsx$/.test(f))
const mountedTransitions = (app.match(/<SearchTransitionHost\b/g) || []).length
const mountedSearchV2 = (app.match(/<SearchExperience\b/g) || []).length

const cssLayers = searchFiles.filter((file) => /^searchTransition.*\.css$/.test(file))
const transitionCss = read('src/features/search/searchTransition.css')
const stabilityCss = read('src/features/search/searchTransition-stability.css')
const importantCount = [transitionCss, stabilityCss].reduce((sum, css) => sum + (css.match(/!important/g) || []).length, 0)

const deployWorkflows = []
for (const file of workflowFiles) {
  const content = read(`.github/workflows/${file}`)
  if (/deploy-pages@|github-pages-deploy-action|deploy\/github-pages/.test(content)) {
    deployWorkflows.push({ file, directPages: /actions\/deploy-pages@/.test(content), branchPublish: /deploy\/github-pages/.test(content) })
  }
}

const report = {
  liveSearch: 'SearchTransitionHost',
  mountedTransitions,
  mountedSearchV2,
  searchImplementations,
  searchFiles,
  expectedSearchFiles,
  unexpectedSearchFiles,
  missingSearchFiles,
  cssLayers,
  importantCount,
  deployWorkflows,
  findings: [],
}

if (mountedTransitions !== 1) report.findings.push(`Expected exactly one SearchTransitionHost mount, found ${mountedTransitions}`)
if (mountedSearchV2 !== 0) report.findings.push(`Unexpected SearchExperience mount on live branch: ${mountedSearchV2}`)
if (unexpectedSearchFiles.length) report.findings.push(`Unexpected Search files detected: ${unexpectedSearchFiles.join(', ')}`)
if (missingSearchFiles.length) report.findings.push(`Expected Search files missing: ${missingSearchFiles.join(', ')}`)
if (cssLayers.length !== 2) report.findings.push(`Expected exactly 2 Search CSS layers, found ${cssLayers.length}: ${cssLayers.join(', ')}`)
if (importantCount > 35) report.findings.push(`High CSS override debt: ${importantCount} !important declarations across Search CSS layers`)
if (deployWorkflows.length > 1) report.findings.push(`Multiple deployment workflows detected: ${deployWorkflows.map((x) => x.file).join(', ')}`)

console.log(JSON.stringify(report, null, 2))

if (
  mountedTransitions !== 1 ||
  mountedSearchV2 !== 0 ||
  unexpectedSearchFiles.length ||
  missingSearchFiles.length ||
  cssLayers.length !== 2
) process.exit(1)
