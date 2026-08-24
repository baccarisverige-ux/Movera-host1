import { expect, test } from '@playwright/test'

const collections = [
  { route: '/plage', testId: 'page-beach', badge: 'Plage', collectionLabel: 'Collection Plage' },
  { route: '/maison-d-hote', testId: 'page-guesthouse', badge: "Maison d’hôte", collectionLabel: "Collection Maison d’hôte" },
  { route: '/hotel', testId: 'page-hotel', badge: 'Hôtel', collectionLabel: 'Collection Hôtel' },
]

for (const collection of collections) {
  test(`${collection.badge} keeps the refined shared premium hero`, async ({ page }) => {
    await page.goto(`/Movera-host1${collection.route}`)
    const root = page.getByTestId(collection.testId)
    await expect(root).toBeVisible()

    const header = page.locator('.app-shell--collection > .app-shell__header')
    const fixedBadge = header.locator('.app-shell__collection-badge')
    const stage = root.locator('.collection-hero__stage')
    const media = root.locator('.collection-hero__media')
    const hero = root.locator('.portrait-collection-hero__image')
    const badge = root.locator('.collection-hero__badge')
    const title = root.locator('.collection-hero__copy h1')

    await expect(header).toBeVisible()
    await expect(fixedBadge).toHaveText(collection.collectionLabel)
    await expect(stage).toBeVisible()
    await expect(media).toBeVisible()
    await expect(hero).toBeVisible()
    await expect(badge).toBeVisible()
    await expect(badge).toContainText(collection.badge)
    await expect(badge).toContainText('Movera')
    await expect.poll(() => hero.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true)
    await expect.poll(() => title.evaluate(node => Number.parseInt(getComputedStyle(node).fontWeight, 10))).toBeLessThanOrEqual(550)

    const geometry = await page.evaluate(({ rootId }) => {
      const rootNode = document.querySelector(`[data-testid="${rootId}"]`)
      const stageNode = rootNode.querySelector('.collection-hero__stage')
      const mediaNode = rootNode.querySelector('.collection-hero__media')
      const imageNode = rootNode.querySelector('.portrait-collection-hero__image')
      const badgeNode = rootNode.querySelector('.collection-hero__badge')
      const stageRect = stageNode.getBoundingClientRect()
      const mediaRect = mediaNode.getBoundingClientRect()
      const imageRect = imageNode.getBoundingClientRect()
      const badgeRect = badgeNode.getBoundingClientRect()
      return {
        stageLeftInset: mediaRect.left - stageRect.left,
        stageRightInset: stageRect.right - mediaRect.right,
        mediaWidth: mediaRect.width,
        imageWidth: imageRect.width,
        badgeLeft: badgeRect.left,
        mediaRight: mediaRect.right,
      }
    }, { rootId: collection.testId })

    expect(Math.abs(geometry.stageLeftInset - geometry.stageRightInset)).toBeLessThanOrEqual(2)
    expect(geometry.imageWidth).toBeLessThanOrEqual(geometry.mediaWidth)
    expect(geometry.badgeLeft).toBeGreaterThan(geometry.mediaRight - 16)
  })
}
