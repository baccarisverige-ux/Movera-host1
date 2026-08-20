import { test, expect } from '@playwright/test'

const VIEWPORTS = [
  { name: '320x568', width: 320, height: 568 },
  { name: '375x667', width: 375, height: 667 },
  { name: '390x844', width: 390, height: 844 },
  { name: '430x932', width: 430, height: 932 },
]

async function openSearch(page) {
  await page.goto('/')
  await page.getByTestId('home-search').click()
  await expect(page.getByRole('dialog', { name: 'Recherche Movera' })).toBeVisible()
}

async function chooseDestination(page) {
  await page.getByRole('button', { name: 'La Marsa' }).click()
  await page.getByRole('button', { name: 'Continuer' }).click()
}

async function chooseDates(page) {
  const enabledDays = page.locator('.premium-calendar__grid button:not([disabled])')
  await enabledDays.nth(7).click()
  await enabledDays.nth(10).click()
}

for (const viewport of VIEWPORTS) {
  test.describe(`Search V2 ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test('Destination baseline and CTA visibility', async ({ page }) => {
      await openSearch(page)
      await expect(page.getByRole('button', { name: 'Continuer' })).toBeVisible()
      await expect(page).toHaveScreenshot(`search-destination-${viewport.name}.png`, { fullPage: true, animations: 'disabled' })
    })

    test('Dates baseline and CTA visibility', async ({ page }) => {
      await openSearch(page)
      await chooseDestination(page)
      await expect(page.getByText('Choisissez vos dates')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Continuer' })).toBeVisible()
      await expect(page).toHaveScreenshot(`search-dates-${viewport.name}.png`, { fullPage: true, animations: 'disabled' })
    })

    test('Voyageurs baseline and CTA visibility', async ({ page }) => {
      await openSearch(page)
      await chooseDestination(page)
      await chooseDates(page)
      await page.getByRole('button', { name: 'Continuer' }).click()
      await expect(page.getByText('Ajoutez les voyageurs')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Afficher sur la carte' })).toBeVisible()
      await expect(page).toHaveScreenshot(`search-voyageurs-${viewport.name}.png`, { fullPage: true, animations: 'disabled' })
    })
  })
}

test.describe('Search V2 variable iPhone heights', () => {
  test('CTA remains visible with reduced viewport simulating an open keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 560 })
    await openSearch(page)
    const destination = page.getByRole('searchbox', { name: 'Recherche' })
    await destination.fill('La Marsa')
    await destination.focus()
    await expect(page.getByRole('button', { name: 'Continuer' })).toBeVisible()
    await expect(page.locator('.search-v2__footer')).toBeInViewport()
    await expect(page).toHaveScreenshot('search-keyboard-open-390x560.png', { fullPage: true, animations: 'disabled' })
  })

  test('CTA remains visible on short landscape-like height', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 520 })
    await openSearch(page)
    await expect(page.getByRole('button', { name: 'Continuer' })).toBeVisible()
    await expect(page.locator('.search-v2__footer')).toBeInViewport()
    await expect(page).toHaveScreenshot('search-short-height-430x520.png', { fullPage: true, animations: 'disabled' })
  })
})
