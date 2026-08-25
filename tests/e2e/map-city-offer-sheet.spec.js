import { expect, test } from '@playwright/test'

function numberAttribute(locator, name) {
  return locator.getAttribute(name).then((value) => Number(value))
}

test('La Marsa map exposes only its mapped offers in the full-width bottom sheet', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map?destination=la-marsa')

  const pageMap = page.getByTestId('page-map')
  const sheet = page.getByTestId('map-offer-sheet')
  await expect(pageMap).toBeVisible()
  await expect(pageMap).toHaveAttribute('data-city-offer-count', '2')
  await expect(sheet).toBeVisible()
  await expect(sheet.locator('[data-listing-id]')).toHaveCount(2)
  await expect(sheet.locator('[data-listing-id="loft-cote"]')).toHaveCount(1)
  await expect(sheet.locator('[data-listing-id="riad-marsa"]')).toHaveCount(1)
  await expect(sheet.locator('[data-listing-id="villa-perle"]')).toHaveCount(0)

  const mapBox = await pageMap.boundingBox()
  const collapsedBox = await sheet.boundingBox()
  expect(mapBox).not.toBeNull()
  expect(collapsedBox).not.toBeNull()
  expect(Math.abs(collapsedBox.x - mapBox.x)).toBeLessThanOrEqual(1)
  expect(Math.abs(collapsedBox.width - mapBox.width)).toBeLessThanOrEqual(1)

  const visibleCollapsedHeight = mapBox.y + mapBox.height - collapsedBox.y
  expect(visibleCollapsedHeight).toBeGreaterThanOrEqual(45)
  expect(visibleCollapsedHeight).toBeLessThanOrEqual(85)
})

test('dragging the city offer sheet upward progressively zooms the map', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map?destination=la-marsa')

  const surface = page.getByTestId('map-surface')
  const sheet = page.getByTestId('map-offer-sheet')
  const handle = page.getByTestId('map-offer-sheet-handle')
  await expect(sheet).toHaveAttribute('data-progress', '0')

  const zoomBefore = await numberAttribute(surface, 'data-zoom')
  const box = await handle.boundingBox()
  expect(box).not.toBeNull()

  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x, y - 120, { steps: 6 })

  await expect.poll(() => numberAttribute(sheet, 'data-progress')).toBeGreaterThan(0.15)
  await expect.poll(() => numberAttribute(surface, 'data-zoom')).toBeGreaterThan(zoomBefore)

  await page.mouse.move(x, y - 280, { steps: 8 })
  await page.mouse.up()
  await expect.poll(() => numberAttribute(sheet, 'data-progress')).toBeGreaterThanOrEqual(0.5)
})

test('expanded list sticks below the map top bar and shows large one-by-one offers', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map?destination=gammarth')

  const sheet = page.getByTestId('map-offer-sheet')
  const surface = page.getByTestId('map-surface')
  const engine = page.getByTestId('map-engine')
  const searchBar = page.locator('.b225-map-search')

  await page.getByRole('button', { name: 'Afficher la liste des offres' }).click()
  await expect(sheet).toHaveAttribute('data-expanded', 'true')
  await expect(sheet.locator('[data-listing-id]')).toHaveCount(2)

  const list = sheet.locator('.map-offer-sheet__list')
  await expect(list).toHaveCSS('scroll-snap-type', /y/)
  await expect(sheet.locator('[data-listing-id="villa-perle"]')).toHaveCSS('scroll-snap-align', 'start')

  const sheetBox = await sheet.boundingBox()
  const searchBox = await searchBar.boundingBox()
  expect(sheetBox).not.toBeNull()
  expect(searchBox).not.toBeNull()
  const searchBottom = searchBox.y + searchBox.height
  expect(sheetBox.y).toBeGreaterThanOrEqual(searchBottom)
  expect(sheetBox.y - searchBottom).toBeLessThanOrEqual(14)

  const mediaBox = await sheet.locator('[data-listing-id="villa-perle"] .map-offer-sheet__media').boundingBox()
  expect(mediaBox).not.toBeNull()
  expect(mediaBox.width).toBeGreaterThan(340)
  expect(mediaBox.height).toBeGreaterThan(240)

  await sheet.locator('[data-listing-id="villa-emeraude"]').click()
  await expect(engine).toHaveAttribute('data-selected-listing-id', 'villa-emeraude')
  await expect.poll(() => numberAttribute(surface, 'data-zoom')).toBeGreaterThanOrEqual(13.6)
})

test('a destination with no mapped offers shows an honest empty state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map?destination=sousse')

  await expect(page.getByTestId('page-map')).toHaveAttribute('data-city-offer-count', '0')
  await expect(page.getByTestId('map-offer-sheet')).toContainText('Aucune offre Movera dans cette ville')
  await expect(page.getByTestId('map-offer-sheet').locator('[data-listing-id]')).toHaveCount(0)
})
