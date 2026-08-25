import { expect, test } from '@playwright/test'

test('map uses a slim wide search bar with amenity filters only', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map?destination=la-marsa')

  await expect(page.getByTestId('page-map')).toBeVisible()
  await expect(page.locator('.app-shell--guest > .app-shell__nav')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Retour à l’accueil' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Filtres' })).toBeVisible()
  await expect(page.getByTestId('map-property-filters')).toHaveCount(0)

  const header = page.locator('.b225-map-top')
  const toolbar = page.locator('.map-search-filter-stack__toolbar')
  const searchPill = page.locator('.map-search-filter-stack__search-pill')
  const amenityFilters = page.getByTestId('map-amenity-filters')
  const surface = page.getByTestId('map-surface')

  await expect(searchPill).toContainText('Logements à La Marsa')
  await expect(searchPill).not.toContainText('Dates')
  await expect(searchPill).not.toContainText('Voyageurs')
  await expect(page.getByText('Appartement', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Villa', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Hôtel', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Maison d’hôte', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Plage', { exact: true })).toHaveCount(0)

  const headerBox = await header.boundingBox()
  const toolbarBox = await toolbar.boundingBox()
  const searchBox = await searchPill.boundingBox()
  const amenityBox = await amenityFilters.boundingBox()
  const surfaceBox = await surface.boundingBox()

  expect(headerBox).not.toBeNull()
  expect(toolbarBox).not.toBeNull()
  expect(searchBox).not.toBeNull()
  expect(amenityBox).not.toBeNull()
  expect(surfaceBox).not.toBeNull()
  expect(headerBox.height).toBeLessThanOrEqual(90)
  expect(searchBox.height).toBeLessThanOrEqual(40)
  expect(searchBox.width).toBeGreaterThan(280)
  expect(amenityBox.y).toBeGreaterThan(toolbarBox.y + toolbarBox.height)
  expect(Math.abs(surfaceBox.y - (headerBox.y + headerBox.height))).toBeLessThanOrEqual(2)
  expect(Math.abs((headerBox.height + surfaceBox.height) - 844)).toBeLessThanOrEqual(3)

  const firstAmenity = amenityFilters.locator('[data-filter-id]').first()
  const amenityChipBox = await firstAmenity.boundingBox()
  expect(amenityChipBox).not.toBeNull()
  expect(amenityChipBox.height).toBeLessThanOrEqual(26)

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
