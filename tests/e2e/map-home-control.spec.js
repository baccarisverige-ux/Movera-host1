import { expect, test } from '@playwright/test'

test('map hides guest nav and uses the compact reference-style header above the map', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map?destination=la-marsa')

  await expect(page.getByTestId('page-map')).toBeVisible()
  await expect(page.locator('.app-shell--guest > .app-shell__nav')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Retour à l’accueil' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Filtres' })).toBeVisible()
  await expect(page.locator('.map-filter-row__label')).toHaveCount(0)

  const header = page.locator('.b225-map-top')
  const toolbar = page.locator('.map-search-filter-stack__toolbar')
  const searchPill = page.locator('.map-search-filter-stack__search-pill')
  const quickFilters = page.getByTestId('map-quick-filters')
  const surface = page.getByTestId('map-surface')
  const propertyFilters = page.getByTestId('map-property-filters')
  const amenityFilters = page.getByTestId('map-amenity-filters')

  await expect(searchPill).toContainText('Logements à La Marsa')
  await expect(searchPill).toContainText('Dates · Voyageurs')

  const headerBox = await header.boundingBox()
  const toolbarBox = await toolbar.boundingBox()
  const quickBox = await quickFilters.boundingBox()
  const surfaceBox = await surface.boundingBox()
  const propertyBox = await propertyFilters.boundingBox()
  const amenityBox = await amenityFilters.boundingBox()

  expect(headerBox).not.toBeNull()
  expect(toolbarBox).not.toBeNull()
  expect(quickBox).not.toBeNull()
  expect(surfaceBox).not.toBeNull()
  expect(propertyBox).not.toBeNull()
  expect(amenityBox).not.toBeNull()
  expect(headerBox.height).toBeLessThanOrEqual(122)
  expect(Math.abs(propertyBox.y - amenityBox.y)).toBeLessThanOrEqual(2)
  expect(quickBox.y).toBeGreaterThan(toolbarBox.y + toolbarBox.height)
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
