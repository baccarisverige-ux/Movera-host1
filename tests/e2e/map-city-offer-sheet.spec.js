import { expect, test } from '@playwright/test'

function numberAttribute(locator, name) {
  return locator.getAttribute(name).then((value) => Number(value))
}

test('La Marsa map exposes only its mapped offers in the bottom sheet', async ({ page }) => {
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
  await page.mouse.move(x, y - 110, { steps: 6 })

  await expect.poll(() => numberAttribute(sheet, 'data-progress')).toBeGreaterThan(0.15)
  await expect.poll(() => numberAttribute(surface, 'data-zoom')).toBeGreaterThan(zoomBefore)

  await page.mouse.move(x, y - 250, { steps: 8 })
  await page.mouse.up()
  await expect.poll(() => numberAttribute(sheet, 'data-progress')).toBeGreaterThanOrEqual(0.5)
})

test('expanded list moves one offer at a time and selecting an offer focuses its marker', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map?destination=gammarth')

  const sheet = page.getByTestId('map-offer-sheet')
  const surface = page.getByTestId('map-surface')
  const engine = page.getByTestId('map-engine')

  await page.getByRole('button', { name: 'Afficher la liste des offres' }).click()
  await expect(sheet).toHaveAttribute('data-expanded', 'true')
  await expect(sheet.locator('[data-listing-id]')).toHaveCount(2)

  const list = sheet.locator('.map-offer-sheet__list')
  await expect(list).toHaveCSS('scroll-snap-type', /y/)
  await expect(sheet.locator('[data-listing-id="villa-perle"]')).toHaveCSS('scroll-snap-align', 'start')

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
