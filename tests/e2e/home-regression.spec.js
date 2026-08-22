import { expect, test } from '@playwright/test'

test('home keeps its structure, media and approved navigation stable', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByTestId('page-home')).toBeVisible()
  await expect(page.locator('.b225-categories button')).toHaveCount(7)
  const familyIcon = page.locator('.b225-categories button[data-category-id="family"] img')
  await expect(familyIcon).toBeVisible()
  await expect.poll(() => familyIcon.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0)
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
  for (const label of ['Accueil', 'Carte']) {
    if (label !== 'Accueil') await nav.locator('.app-shell__nav-item', { hasText: label }).click()
    await expect(page.locator('.app-shell--guest > .app-shell__nav .app-shell__nav-item[data-active="true"] span')).toHaveText(label)
  }
  for (const label of ['Favoris', 'Messages', 'Profil']) {
    await expect(nav.locator('.app-shell__nav-item', { hasText: label })).toHaveAttribute('aria-disabled', 'true')
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
  await expect(villaImage).toHaveAttribute('src', /villa-emeraude-.*\.webp$/)
  await villaImage.scrollIntoViewIfNeeded()
  await expect.poll(() => villaImage.evaluate(image => image.naturalWidth)).toBeGreaterThan(0)
})

test('separate collection routes keep their own identity and shared filtering', async ({ page }) => {
  for (const collection of [
    { route: '/plage', testId: 'page-beach', title: /La Tunisie\s*côté mer\./, city: 'Gammarth' },
    { route: '/maison-d-hote', testId: 'page-guesthouse', title: /L’accueil tunisien,\s*autrement\./, city: 'La Marsa' },
  ]) {
    await page.goto(`/Movera-host1${collection.route}`)
    await expect(page.getByTestId(collection.testId)).toBeVisible()
    await expect(page.locator('.app-shell__header')).toBeVisible()
    await expect(page.locator('.app-shell__header')).toContainText('Movera Host')
    await expect(page.locator('.beach-hero__top, .beach-glass-button, .beach-hero__counter')).toHaveCount(0)
    await expect(page.locator('.beach-hero__image')).toHaveAttribute('src', /page-hero\.webp$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(collection.title)
    await page.getByLabel('Ville en Tunisie').fill(collection.city)
    await expect(page.locator('.beach-results__head > div > span')).toHaveText(`Séjours à ${collection.city}`)
    expect(await page.locator('.beach-offer').count()).toBeGreaterThan(0)
  }
})

test('category scroll animation reattaches after returning to Home', async ({ page }) => {
  await page.goto('/')
  await page.locator('.b225-categories button[data-category-id="beach"]').click()
  await expect(page.getByTestId('page-beach')).toBeVisible()
  await page.getByRole('button', { name: 'Retour à l’accueil' }).click()
  await expect(page.getByTestId('page-home')).toBeVisible()

  await page.evaluate(() => window.scrollTo(0, 900))
  await expect.poll(() => page.evaluate(() => Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--movera-category-upward-travel'),
  ))).toBeGreaterThan(10)
  await expect(page.getByTestId('home-categories')).toHaveClass(/movera-categories-moving-under-header/)
})
