import { expect, test } from '@playwright/test'

function numberAttribute(locator, name) {
  return locator.getAttribute(name).then((value) => Number(value))
}

test('premium map filters update offers and markers without moving the map', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map')

  const pageMap = page.getByTestId('page-map')
  const sheet = page.getByTestId('map-offer-sheet')
  const surface = page.getByTestId('map-surface')
  const propertyFilters = page.getByTestId('map-property-filters')
  const amenityFilters = page.getByTestId('map-amenity-filters')

  await expect(page.getByTestId('map-search-filter-stack')).toBeVisible()
  await expect(propertyFilters.locator('[data-filter-id="apartment"]')).toContainText('Appartement')
  await expect(propertyFilters.locator('[data-filter-id="villa"]')).toContainText('Villa')
  await expect(propertyFilters.locator('[data-filter-id="hotel"]')).toContainText('Hôtel')
  await expect(propertyFilters.locator('[data-filter-id="guesthouse"]')).toContainText('Maison d’hôte')
  await expect(propertyFilters.locator('[data-filter-id="beach"]')).toContainText('Plage')
  await expect(amenityFilters.locator('[data-filter-id="wifi"]')).toContainText('Wi‑Fi')
  await expect(amenityFilters.locator('[data-filter-id="pool"]')).toContainText('Piscine')
  await expect(amenityFilters.locator('[data-filter-id="parking"]')).toContainText('Parking')
  await expect(amenityFilters.locator('[data-filter-id="ac"]')).toContainText('Clim')
  await expect(amenityFilters.locator('[data-filter-id="pet"]')).toContainText('Animaux')

  await expect(pageMap).toHaveAttribute('data-city-offer-count', '8')
  const zoomBefore = await numberAttribute(surface, 'data-zoom')

  await propertyFilters.locator('[data-filter-id="villa"]').click()
  await expect(propertyFilters.locator('[data-filter-id="villa"]')).toHaveAttribute('aria-pressed', 'true')
  await expect(pageMap).toHaveAttribute('data-city-offer-count', '3')
  await expect(sheet.locator('[data-listing-id]')).toHaveCount(3)
  expect(await numberAttribute(surface, 'data-zoom')).toBeCloseTo(zoomBefore, 4)

  await amenityFilters.locator('[data-filter-id="pool"]').click()
  await expect(amenityFilters.locator('[data-filter-id="pool"]')).toHaveAttribute('aria-pressed', 'true')
  await expect(pageMap).toHaveAttribute('data-city-offer-count', '1')
  await expect(sheet.locator('[data-listing-id="villa-emeraude"]')).toHaveCount(1)
  await expect(sheet.locator('[data-listing-id="villa-perle"]')).toHaveCount(0)
  expect(await numberAttribute(surface, 'data-zoom')).toBeCloseTo(zoomBefore, 4)

  await page.getByRole('button', { name: 'Réinitialiser les filtres' }).click()
  await expect(pageMap).toHaveAttribute('data-city-offer-count', '8')
  await expect(sheet.locator('[data-listing-id]')).toHaveCount(8)
})

test('filters can produce an honest empty state inside a destination', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/map?destination=la-marsa')

  const pageMap = page.getByTestId('page-map')
  const sheet = page.getByTestId('map-offer-sheet')
  const amenityFilters = page.getByTestId('map-amenity-filters')

  await expect(pageMap).toHaveAttribute('data-city-offer-count', '2')
  await amenityFilters.locator('[data-filter-id="pool"]').click()
  await expect(pageMap).toHaveAttribute('data-city-offer-count', '0')
  await expect(sheet).toContainText('Aucune offre Movera dans cette ville')
  await expect(sheet.locator('[data-listing-id]')).toHaveCount(0)
})
