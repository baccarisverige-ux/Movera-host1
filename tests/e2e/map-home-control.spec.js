import { expect, test } from '@playwright/test'

test('map hides guest nav and keeps the map below the dedicated Movera header', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map?destination=la-marsa')

  await expect(page.getByTestId('page-map')).toBeVisible()
  await expect(page.locator('.app-shell--guest > .app-shell__nav')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Retour à l’accueil' })).toBeVisible()
  await expect(page.locator('.b225-map-filter-button')).toHaveCount(0)

  const header = page.locator('.b225-map-top')
  const surface = page.getByTestId('map-surface')
  const headerBox = await header.boundingBox()
  const surfaceBox = await surface.boundingBox()
  expect(headerBox).not.toBeNull()
  expect(surfaceBox).not.toBeNull()
  expect(Math.abs(surfaceBox.y - (headerBox.y + headerBox.height))).toBeLessThanOrEqual(2)
  expect(Math.abs((headerBox.height + surfaceBox.height) - 844)).toBeLessThanOrEqual(3)
  await expect(header).toHaveCSS('background-image', /linear-gradient/)

  await page.getByRole('button', { name: 'Retour à l’accueil' }).click()
  await expect(page.getByTestId('page-home')).toBeVisible()
  await expect(page).toHaveURL(/\/Movera-host1\/?$/)
})

test('bottom navigation remains available outside the map', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/')

  await expect(page.getByTestId('page-home')).toBeVisible()
  await expect(page.locator('.app-shell--guest > .app-shell__nav')).toBeVisible()
})
