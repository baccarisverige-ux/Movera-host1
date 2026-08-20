import { test, expect } from '@playwright/test'

const APP = '/Movera-host1/'

async function openSearch(page) {
  await page.goto(APP, { waitUntil: 'networkidle' })
  await page.getByTestId('home-search').click()
  await expect(page.getByRole('dialog', { name: 'Recherche Movera' })).toBeVisible()
}

test.describe('Search V2 performance budgets', () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' })

  test('opening and stepping through search avoids blocking long tasks', async ({ page }) => {
    await page.addInitScript(() => {
      window.__moveraLongTasks = []
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              window.__moveraLongTasks.push({ duration: entry.duration, startTime: entry.startTime })
            }
          })
          observer.observe({ type: 'longtask', buffered: true })
        } catch {}
      }
    })

    await openSearch(page)
    await page.getByPlaceholder('Ville, plage ou région').fill('Hammamet')
    await page.getByRole('button', { name: 'Continuer' }).click()
    await expect(page.getByText('Choisissez vos dates')).toBeVisible()
    await page.getByRole('button', { name: 'Mois suivant' }).click()
    await page.getByRole('button', { name: 'Mois précédent' }).click()

    const metrics = await page.evaluate(() => ({
      longTasks: window.__moveraLongTasks || [],
      nodeCount: document.querySelectorAll('*').length,
      searchNodes: document.querySelector('.search-v2')?.querySelectorAll('*').length || 0,
    }))

    const worstLongTask = Math.max(0, ...metrics.longTasks.map((task) => task.duration))
    expect(worstLongTask).toBeLessThan(200)
    expect(metrics.searchNodes).toBeLessThan(220)
    expect(metrics.nodeCount).toBeLessThan(1600)
  })

  test('search open and step transitions stay responsive', async ({ page }) => {
    await page.goto(APP, { waitUntil: 'networkidle' })

    const openStart = Date.now()
    await page.getByTestId('home-search').click()
    await expect(page.getByRole('dialog', { name: 'Recherche Movera' })).toBeVisible()
    const openElapsed = Date.now() - openStart

    await page.getByPlaceholder('Ville, plage ou région').fill('La Marsa')
    const stepStart = Date.now()
    await page.getByRole('button', { name: 'Continuer' }).click()
    await expect(page.getByText('Choisissez vos dates')).toBeVisible()
    const stepElapsed = Date.now() - stepStart

    expect(openElapsed).toBeLessThan(900)
    expect(stepElapsed).toBeLessThan(700)
  })

  test('scrolling search content does not trigger layout overflow', async ({ page }) => {
    await openSearch(page)
    const content = page.locator('.search-v2__content')
    await content.evaluate((node) => node.scrollTo({ top: node.scrollHeight, behavior: 'instant' }))
    const geometry = await page.evaluate(() => {
      const root = document.querySelector('.search-v2')
      const footer = document.querySelector('.search-v2__footer')
      const footerRect = footer?.getBoundingClientRect()
      return {
        horizontalOverflow: Math.max(root?.scrollWidth || 0, document.documentElement.scrollWidth) - window.innerWidth,
        footerBottom: footerRect?.bottom ?? Infinity,
        viewportHeight: window.innerHeight,
      }
    })
    expect(geometry.horizontalOverflow).toBeLessThanOrEqual(1)
    expect(geometry.footerBottom).toBeLessThanOrEqual(geometry.viewportHeight + 1)
  })
})
