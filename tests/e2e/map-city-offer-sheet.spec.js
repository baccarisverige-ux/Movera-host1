import { expect, test } from '@playwright/test'

function numberAttribute(locator, name) {
  return locator.getAttribute(name).then((value) => Number(value))
}

test('La Marsa map exposes only its mapped offers in the full-width Motion bottom sheet', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map?destination=la-marsa')

  const pageMap = page.getByTestId('page-map')
  const sheet = page.getByTestId('map-offer-sheet')
  await expect(pageMap).toBeVisible()
  await expect(pageMap).toHaveAttribute('data-city-offer-count', '2')
  await expect(sheet).toBeVisible()
  await expect(sheet).toHaveAttribute('data-motion-engine', 'motion')
  await expect(sheet).toHaveAttribute('data-motion-boundary', 'shared')
  await expect(sheet.locator('[data-motion-list="map-offers"]')).toBeVisible()
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

test('Motion drag progressively zooms the map and springs to a snap point', async ({ page }) => {
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
  await page.mouse.move(x, y - 120, { steps: 8 })

  await expect.poll(() => numberAttribute(sheet, 'data-progress')).toBeGreaterThan(0.15)
  await expect.poll(() => numberAttribute(surface, 'data-zoom')).toBeGreaterThan(zoomBefore)

  await page.mouse.move(x, y - 280, { steps: 10 })
  await page.mouse.up()
  await expect.poll(() => numberAttribute(sheet, 'data-progress')).toBeGreaterThanOrEqual(0.48)
})

test('expanded list scrolls freely without moving or reselecting the map', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map?destination=gammarth')

  const sheet = page.getByTestId('map-offer-sheet')
  const surface = page.getByTestId('map-surface')
  const engine = page.getByTestId('map-engine')
  const topPanel = page.locator('.b225-map-top')

  await page.getByRole('button', { name: 'Afficher la liste des offres' }).click()
  await expect(sheet).toHaveAttribute('data-expanded', 'true')
  await expect(sheet.locator('[data-listing-id]')).toHaveCount(2)

  const list = sheet.locator('.map-offer-sheet__list')
  await expect(list).toHaveCSS('scroll-snap-type', 'none')
  await expect(list).toHaveAttribute('data-motion-list', 'map-offers')
  await expect(list).toHaveAttribute('data-map-scroll', 'independent')
  await expect(list).toHaveAttribute('data-sheet-handoff', 'close-from-list')

  const sheetBox = await sheet.boundingBox()
  const topPanelBox = await topPanel.boundingBox()
  expect(sheetBox).not.toBeNull()
  expect(topPanelBox).not.toBeNull()
  const panelBottom = topPanelBox.y + topPanelBox.height
  expect(Math.abs(sheetBox.y - panelBottom)).toBeLessThanOrEqual(2)

  const mediaBox = await sheet.locator('[data-listing-id="villa-perle"] .map-offer-sheet__media').boundingBox()
  expect(mediaBox).not.toBeNull()
  expect(mediaBox.width).toBeGreaterThan(340)
  expect(mediaBox.height).toBeGreaterThan(240)

  await page.waitForTimeout(500)
  const zoomBeforeScroll = await numberAttribute(surface, 'data-zoom')
  const selectedBeforeScroll = await engine.getAttribute('data-selected-listing-id')
  const scrollBefore = await list.evaluate((node) => node.scrollTop)

  await list.evaluate((node) => node.scrollBy({ top: 360, behavior: 'instant' }))
  await expect.poll(() => list.evaluate((node) => node.scrollTop)).toBeGreaterThan(scrollBefore)
  await page.waitForTimeout(250)

  expect(await numberAttribute(surface, 'data-zoom')).toBeCloseTo(zoomBeforeScroll, 4)
  expect(await engine.getAttribute('data-selected-listing-id')).toBe(selectedBeforeScroll)

  await sheet.locator('[data-listing-id="villa-emeraude"]').click()
  await expect(engine).toHaveAttribute('data-selected-listing-id', 'villa-emeraude')
  await expect.poll(() => numberAttribute(surface, 'data-zoom')).toBeGreaterThanOrEqual(13.6)
})

test('downward swipe starting on an offer can close the fully open sheet', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map?destination=gammarth')

  const sheet = page.getByTestId('map-offer-sheet')
  const list = sheet.locator('.map-offer-sheet__list')
  const firstOffer = sheet.locator('[data-listing-id="villa-perle"]')

  await page.getByRole('button', { name: 'Afficher la liste des offres' }).click()
  await expect(sheet).toHaveAttribute('data-expanded', 'true')
  await list.evaluate((node) => { node.scrollTop = 0 })
  await expect.poll(() => numberAttribute(sheet, 'data-progress')).toBeGreaterThan(0.95)

  await firstOffer.evaluate((node) => {
    const fireTouch = (type, clientY, cancelable = true) => {
      const event = new Event(type, { bubbles: true, cancelable })
      Object.defineProperty(event, 'touches', {
        configurable: true,
        value: type === 'touchend' ? [] : [{ clientY }],
      })
      node.dispatchEvent(event)
    }

    fireTouch('touchstart', 280, false)
    fireTouch('touchmove', 315)
    fireTouch('touchmove', 390)
    fireTouch('touchend', 390, false)
  })

  await expect.poll(() => numberAttribute(sheet, 'data-progress')).toBeLessThan(0.86)
  await expect(sheet).toHaveAttribute('data-expanded', 'false')
})

test('a destination with no mapped offers shows an honest empty state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map?destination=sousse')

  await expect(page.getByTestId('page-map')).toHaveAttribute('data-city-offer-count', '0')
  await expect(page.getByTestId('map-offer-sheet')).toHaveAttribute('data-motion-engine', 'motion')
  await expect(page.getByTestId('map-offer-sheet')).toHaveAttribute('data-motion-boundary', 'shared')
  await expect(page.getByTestId('map-offer-sheet')).toContainText('Aucune offre Movera dans cette ville')
  await expect(page.getByTestId('map-offer-sheet').locator('[data-listing-id]')).toHaveCount(0)
})
