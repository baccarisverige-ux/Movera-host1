import { expect, test } from '@playwright/test'

async function openSearchOnCurrentPage(page) {
  await page.locator('.b225-search').click({ position: { x: 80, y: 25 } })
  const transition = page.getByTestId('search-transition')
  await expect(transition).toBeVisible()
  await expect.poll(async () => transition.getAttribute('data-ready')).toBe('true')
  return transition
}

async function openSearch(page) {
  await page.goto('/')
  await expect(page.getByTestId('page-home')).toBeVisible()
  return openSearchOnCurrentPage(page)
}

async function chooseTwoAvailableDates(page) {
  const available = page.locator('.movera-st__calendar-grid button.movera-st__day:not(:disabled)')
  const count = await available.count()
  expect(count).toBeGreaterThanOrEqual(2)
  const firstLabel = await available.nth(0).getAttribute('aria-label')
  const secondLabel = await available.nth(Math.min(3, count - 1)).getAttribute('aria-label')
  await page.getByRole('button', { name: firstLabel, exact: true }).click()
  await page.getByRole('button', { name: secondLabel, exact: true }).click()
}

test.describe('Search live E2E / UAT / cleanup safety', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('UAT: Destination opens with bounded height and no page scroll', async ({ page }) => {
    const startScroll = await page.evaluate(() => window.scrollY)
    const transition = await openSearch(page)
    await expect(transition).toHaveAttribute('data-step', 'destination')
    await expect(page.getByRole('dialog', { name: 'Recherche Movera' })).toBeVisible()
    await expect(page.getByText('Recherches récentes')).toBeVisible()
    await expect(page.getByText('Destinations suggérées')).toBeVisible()

    const geometry = await page.locator('.movera-st__panel').evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return { height: rect.height, top: rect.top, bottom: rect.bottom, viewport: window.innerHeight }
    })
    expect(geometry.height).toBeLessThanOrEqual(550)
    expect(geometry.top).toBeGreaterThanOrEqual(0)
    expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewport + 1)
    expect(await page.evaluate(() => window.scrollY)).toBe(startScroll)
  })

  test('E2E: Destination → Dates → Voyageurs → Map', async ({ page }) => {
    const transition = await openSearch(page)
    await page.locator('[data-destination="la-marsa"]').click()
    await expect(transition).toHaveAttribute('data-step', 'dates')
    await expect(page.getByTestId('search-calendar')).toBeVisible()

    const datesHeight = await page.locator('.movera-st__panel').evaluate((el) => el.getBoundingClientRect().height)
    expect(datesHeight).toBeLessThanOrEqual(640)

    await chooseTwoAvailableDates(page)
    await page.getByRole('button', { name: /Continuer vers les voyageurs/i }).click()
    await expect(transition).toHaveAttribute('data-step', 'guests')
    await expect(page.getByText('Qui voyage ?')).toBeVisible()

    const guestsHeight = await page.locator('.movera-st__panel').evaluate((el) => el.getBoundingClientRect().height)
    expect(guestsHeight).toBeLessThanOrEqual(700)

    await page.getByRole('button', { name: /Rechercher sur la carte/i }).click()
    await expect(page.getByTestId('page-map')).toBeVisible({ timeout: 10_000 })
  })

  test('UAT: close returns cleanly to Home and unlocks document', async ({ page }) => {
    await openSearch(page)
    await page.getByRole('button', { name: 'Fermer' }).click()
    await expect(page.getByTestId('search-transition')).toBeHidden({ timeout: 5_000 })
    await expect(page.getByTestId('page-home')).toBeVisible()
    const locks = await page.evaluate(() => ({
      html: document.documentElement.dataset.moveraSearchLock,
      body: document.body.dataset.moveraSearchLock,
      bodyPosition: document.body.style.position,
    }))
    expect(locks.html).toBeUndefined()
    expect(locks.body).toBeUndefined()
    expect(locks.bodyPosition).not.toBe('fixed')
  })

  test('regression: close after Home scroll restores position and unlocks document', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('page-home')).toBeVisible()

    await page.evaluate(() => window.scrollTo(0, Math.min(900, Math.max(500, document.documentElement.scrollHeight * 0.35))))
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(300)
    const beforeOpen = await page.evaluate(() => window.scrollY)

    await openSearchOnCurrentPage(page)
    await page.getByRole('button', { name: 'Fermer' }).click()
    await expect(page.getByTestId('search-transition')).toBeHidden({ timeout: 5_000 })
    await expect(page.getByTestId('page-home')).toBeVisible()

    await expect.poll(async () => page.evaluate(() => Math.round(window.scrollY))).toBe(Math.round(beforeOpen))
    const locks = await page.evaluate(() => ({
      html: document.documentElement.dataset.moveraSearchLock,
      body: document.body.dataset.moveraSearchLock,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
    }))
    expect(locks.html).toBeUndefined()
    expect(locks.body).toBeUndefined()
    expect(locks.bodyPosition).not.toBe('fixed')
    expect(locks.bodyTop).toBe('')
  })

  test('cleanup safety: only the live Search transition is mounted', async ({ page }) => {
    await openSearch(page)
    expect(await page.locator('[data-testid="search-transition"]').count()).toBe(1)
    expect(await page.locator('.search-v2').count()).toBe(0)
  })
})
