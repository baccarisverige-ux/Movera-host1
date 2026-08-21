import { expect, test } from '@playwright/test'

test('home keeps B225 structure, media and guest navigation stable', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByTestId('page-home')).toBeVisible()
  await expect(page.locator('.b225-categories button')).toHaveCount(7)
  await expect(page.locator('.b225-city')).toHaveCount(10)
  await expect(page.getByTestId('home-services').locator('.b225-service-card')).toHaveCount(4)
  expect(await page.getByTestId('home-featured').locator('.b225-featured-card').count()).toBeGreaterThanOrEqual(3)
  await expect(page.getByTestId('home-tunisia-map')).toHaveCount(1)

  for (const id of ['prestige', 'experience', 'partner']) {
    const button = page.locator(`.b225-categories button[data-category-id="${id}"]`)
    await expect(button).toHaveCount(1)
    await button.click()
    await expect(button).toBeVisible()
  }
  await page.locator('.b225-categories button[data-category-id="all"]').click()

  const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)
  const blanks = await page.locator('.b225-card__image').evaluateAll(nodes => nodes.filter(node => {
    const img = node.querySelector('img')
    return !img || !img.getAttribute('src')
  }).length)
  expect(blanks).toBe(0)

  const nav = page.locator('.app-shell--guest > .app-shell__nav')
  await expect(nav).toBeVisible()
  await expect(nav.locator('.app-shell__nav-item')).toHaveCount(5)
  for (const label of ['Accueil', 'Carte', 'Favoris']) {
    if (label !== 'Accueil') await nav.locator('.app-shell__nav-item', { hasText: label }).click()
    await expect(page.locator('.app-shell--guest > .app-shell__nav .app-shell__nav-item[data-active="true"] span')).toHaveText(label)
  }
  expect(errors).toEqual([])
})

test('critical collection pages contain no broken project images', async ({ page }) => {
  for (const route of ['/', '/plage', '/maison-d-hote']) {
    await page.goto(route === '/' ? '/' : `/Movera-host1${route}`)
    await expect(page.locator('img')).not.toHaveCount(0)
    await page.waitForTimeout(1_000)

    const brokenImages = await page.locator('img').evaluateAll(images => images
      .filter(image => new URL(image.currentSrc || image.src).origin === window.location.origin)
      .filter(image => !image.complete || image.naturalWidth === 0)
      .map(image => image.currentSrc || image.src))

    expect(brokenImages, `${route}: broken image sources`).toEqual([])
  }

  await page.goto('/')
  const villaImage = page.getByTestId('home-card-villa-emeraude').locator('img').first()
  await expect(villaImage).toHaveAttribute('src', '/Movera-host1/assets/listing-villa-emeraude.webp')
  await villaImage.scrollIntoViewIfNeeded()
  await expect.poll(() => villaImage.evaluate(image => image.naturalWidth)).toBeGreaterThan(0)
})
