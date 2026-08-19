import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function expectNoSeriousViolations(page, label) {
  const results = await new AxeBuilder({ page }).analyze()
  const blocking = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact))
  expect(blocking, `${label}: serious/critical accessibility violations`).toEqual([])
}

test('home has no serious accessibility violations', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('page-home')).toBeVisible()
  await expectNoSeriousViolations(page, 'Home')
})

test('search destination state has no serious accessibility violations', async ({ page }) => {
  await page.goto('/')
  await page.locator('.b225-search').click({ position: { x: 80, y: 25 } })
  await expect.poll(async () => page.getByTestId('search-transition').getAttribute('data-ready')).toBe('true')
  await expectNoSeriousViolations(page, 'Search destination')
})
