import { expect, test } from '@playwright/test'

test('map hides guest nav and keeps a compact Movera header above the map', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map?destination=la-marsa')

  await expect(page.getByTestId('page-map')).toBeVisible()
  await expect(page.locator('.app-shell--guest > .app-shell__nav')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Retour à l’accueil' })).toBeVisible()
  await expect(page.locator('.b225-map-filter-button')).toHaveCount(0)

  const header = page.locator('.b225-map-top')
  const surface = page.getByTestId('map-surface')
  const propertyFilters = page.getByTestId('map-property-filters')
  const amenityFilters = page.getByTestId('map-amenity-filters')
  const headerBox = await header.boundingBox()
  const surfaceBox = await surface.boundingBox()
  const propertyBox = await propertyFilters.boundingBox()
  const amenityBox = await amenityFilters.boundingBox()

  expect(headerBox).not.toBeNull()
  expect(surfaceBox).not.toBeNull()
  expect(propertyBox).not.toBeNull()
  expect(amenityBox).not.toBeNull()
  expect(headerBox.height).toBeLessThanOrEqual(145)
  expect(propertyBox.y + propertyBox.height).toBeLessThan(amenityBox.y)
  expect(Math.abs(surfaceBox.y - (headerBox.y + headerBox.height))).toBeLessThanOrEqual(2)
  expect(Math.abs((headerBox.height + surfaceBox.height) - 844)).toBeLessThanOrEqual(3)
  await expect(header).toHaveCSS('background-color', 'rgb(255, 255, 255)')

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
