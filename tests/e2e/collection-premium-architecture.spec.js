import { expect, test } from '@playwright/test'

const collections = [
  { route: '/plage', testId: 'page-beach', badge: 'Plage' },
  { route: '/maison-d-hote', testId: 'page-guesthouse', badge: "Maison d’hôte" },
  { route: '/hotel', testId: 'page-hotel', badge: 'Hôtel' },
]

for (const collection of collections) {
  test(`${collection.badge} uses the shared compact premium hero`, async ({ page }) => {
    await page.goto(`/Movera-host1${collection.route}`)
    const root = page.getByTestId(collection.testId)
    await expect(root).toBeVisible()

    const stage = root.locator('.collection-hero__stage')
    const media = root.locator('.collection-hero__media')
    const hero = root.locator('.portrait-collection-hero__image')
    const badge = root.locator('.collection-hero__badge')

    await expect(stage).toBeVisible()
    await expect(media).toBeVisible()
    await expect(hero).toBeVisible()
    await expect(badge).toBeVisible()
    await expect(badge).toContainText(collection.badge)
    await expect(badge).toContainText('Movera')
    await expect.poll(() => hero.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true)

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
        stageWidth: stageRect.width,
        mediaWidth: mediaRect.width,
        imageWidth: imageRect.width,
        badgeLeft: badgeRect.left,
        mediaRight: mediaRect.right,
      }
    }, { rootId: collection.testId })

    expect(geometry.imageWidth).toBeLessThan(geometry.stageWidth * 0.8)
    expect(geometry.imageWidth).toBeLessThanOrEqual(geometry.mediaWidth)
    expect(geometry.badgeLeft).toBeGreaterThanOrEqual(geometry.mediaRight - 2)
  })
}
