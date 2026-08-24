import { expect, test } from '@playwright/test'

test('Home keeps vertical scroll independent from horizontal rails', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('page-home')).toBeVisible()

  const categories = page.getByTestId('home-categories')
  await expect.poll(() => categories.evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true)
  await categories.evaluate(node => { node.scrollLeft = Math.min(120, node.scrollWidth - node.clientWidth) })
  await expect.poll(() => categories.evaluate(node => node.scrollLeft)).toBeGreaterThan(0)

  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'auto' }))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500)

  const allRail = page.getByTestId('home-selection-all').locator('.b225-offer-scroll')
  await expect.poll(() => allRail.evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true)
  await allRail.evaluate(node => { node.scrollLeft = Math.min(120, node.scrollWidth - node.clientWidth) })
  await expect.poll(() => allRail.evaluate(node => node.scrollLeft)).toBeGreaterThan(0)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500)

  const pageOverflow = await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - window.innerWidth)
  expect(pageOverflow).toBeLessThanOrEqual(1)
})

test('forward navigation starts at top and browser Back restores Home scroll', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('page-home')).toBeVisible()

  await page.evaluate(() => window.scrollTo({ top: 850, behavior: 'auto' }))
  const savedScroll = await page.evaluate(() => window.scrollY)
  expect(savedScroll).toBeGreaterThan(500)

  await page.locator('.b225-categories button[data-category-id="beach"]').evaluate(button => button.click())
  await expect(page.getByTestId('page-beach')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1)

  await page.goBack()
  await expect(page.getByTestId('page-home')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(savedScroll - 80)
})

test('closing Search restores Home scroll and releases the document lock', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('page-home')).toBeVisible()

  await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'auto' }))
  const before = await page.evaluate(() => window.scrollY)
  expect(before).toBeGreaterThan(400)

  await page.locator('.b225-search').click()
  await expect(page.getByTestId('search-transition')).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.body.dataset.moveraSearchLock)).toBe('true')

  await page.locator('.movera-st__close').click()
  await expect(page.getByTestId('search-transition')).toHaveCount(0, { timeout: 2500 })
  await expect.poll(() => page.evaluate(() => document.body.dataset.moveraSearchLock || '')).toBe('')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before - 80)
})
