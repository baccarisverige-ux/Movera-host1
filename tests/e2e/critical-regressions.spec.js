import { expect, test } from '@playwright/test'

const appPath = (path) => `/Movera-host1${path === '/' ? '/' : path}`

test.describe('Movera critical permanent regressions', () => {
  test('host management flow stays functional', async ({ page }) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.addInitScript(() => {
      let activeStorageListeners = 0
      const add = window.addEventListener.bind(window)
      const remove = window.removeEventListener.bind(window)
      window.addEventListener = (type, listener, options) => {
        if (type === 'storage') activeStorageListeners += 1
        return add(type, listener, options)
      }
      window.removeEventListener = (type, listener, options) => {
        if (type === 'storage') activeStorageListeners -= 1
        return remove(type, listener, options)
      }
      window.__activeHostStorageListeners = () => activeStorageListeners
    })

    const expectOwnedListenerCount = (count) => expect.poll(
      () => page.evaluate(() => window.__activeHostStorageListeners()),
    ).toBe(count)

    await page.goto(appPath('/host'))
    await expect(page.getByTestId('host-kpi-listings')).toBeVisible()
    await expect(page.getByTestId('host-upcoming')).toBeVisible()
    await expect(page.getByTestId('host-alerts')).toBeVisible()
    await expectOwnedListenerCount(1)

    await page.goto(appPath('/host/listings'))
    await page.evaluate(() => localStorage.removeItem('movera-host-listings-v1'))
    await page.reload()
    await expectOwnedListenerCount(1)
    await page.getByTestId('host-create-link').click()
    await expect(page).toHaveURL(/\/host\/listings\/new$/)
    await expectOwnedListenerCount(1)
    await page.getByRole('button', { name: 'Enregistrer' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    await page.getByLabel('Titre').fill('Villa Test')
    await page.getByLabel('Prix par nuit').fill('300')
    await page.getByRole('button', { name: 'Enregistrer' }).click()
    await expect(page).toHaveURL(/\/host\/listings$/)
    await expect(page.getByText('Villa Test')).toBeVisible()

    const row = page.getByText('Villa Test').locator('..').locator('..')
    await row.getByRole('button', { name: 'Modifier' }).click()
    await expectOwnedListenerCount(1)
    await page.getByLabel('Prix par nuit').fill('350')
    await page.getByRole('button', { name: 'Enregistrer' }).click()
    await expect(page.getByText('350 TND/nuit')).toBeVisible()

    await page.goto(appPath('/host/reservations'))
    await expectOwnedListenerCount(0)
    for (const state of ['pending', 'confirmed', 'completed', 'cancelled']) {
      await expect(page.getByTestId(`reservation-${state}`)).toBeVisible()
    }

    await page.goto(appPath('/host/calendar'))
    await expect(page.getByTestId('page-host-calendar')).toBeVisible()
    await page.goto(appPath('/host/earnings'))
    await expect(page.getByTestId('earning-row')).toHaveCount(2)
    await page.goto(appPath('/host/settings'))
    await expect(page.getByTestId('page-host-settings')).toBeVisible()
    await expectOwnedListenerCount(0)
    expect(errors).toEqual([])
  })

  test('resilience, offline and recoverable failures stay functional', async ({ page }) => {
    for (const state of ['loading', 'empty', 'success']) {
      await page.goto(`/resilience-lab?state=${state}`)
      await expect(page.getByTestId(`state-${state}`)).toBeVisible()
    }

    await page.goto('/resilience-lab?state=error')
    for (const kind of ['api', 'map']) {
      const card = page.getByTestId(`resilience-${kind}`)
      await card.getByRole('button', { name: 'Réessayer' }).click()
      await card.getByRole('button', { name: 'Réessayer' }).click()
      await expect(card).toHaveAttribute('data-attempts', '2')
      await expect(card.getByRole('button')).toBeDisabled()
    }

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => false })
      window.dispatchEvent(new Event('offline'))
    })
    await expect(page.getByTestId('offline-fallback')).toBeVisible()
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => true })
      window.dispatchEvent(new Event('online'))
    })
    await expect(page.getByTestId('offline-fallback')).toBeHidden()

    await page.goto('/listing/missing')
    await expect(page.getByTestId('page-listing-missing')).toBeVisible()
    await page.goto('/?__testError=1')
    await expect(page.getByTestId('global-error-boundary')).toBeVisible()
    await page.getByRole('button', { name: 'Réessayer' }).click()
    await expect(page.getByTestId('page-home')).toBeVisible()
  })

  test('responsive, accessibility and reduced motion guard stays active', async ({ page }) => {
    const sizes = [[320, 568], [375, 812], [390, 844], [430, 932], [768, 1024], [1024, 768]]
    const routes = ['/', '/map', '/listing/marsa-sea', '/booking/marsa-sea', '/host']

    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height })
      for (const route of routes) {
        await page.goto(route)
        const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth)
        expect(overflow).toBeLessThanOrEqual(1)
      }
    }

    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const nav = page.locator('.app-shell__nav-item').first()
    const box = await nav.boundingBox()
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
    await expect(page.locator('[aria-current="page"]')).toHaveCount(1)
    await nav.focus()
    await expect(nav).toBeFocused()
  })

  test('map lifecycle and update bursts stay stable', async ({ page }) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))

    await page.addInitScript(() => {
      const watched = new Set(['orientationchange', 'pagehide', 'pageshow', 'visibilitychange'])
      const counts = {}
      const add = EventTarget.prototype.addEventListener
      const remove = EventTarget.prototype.removeEventListener
      EventTarget.prototype.addEventListener = function (type, ...rest) {
        if (watched.has(type)) counts[type] = (counts[type] || 0) + 1
        return add.call(this, type, ...rest)
      }
      EventTarget.prototype.removeEventListener = function (type, ...rest) {
        if (watched.has(type)) counts[type] = (counts[type] || 0) - 1
        return remove.call(this, type, ...rest)
      }
      window.__listenerCounts = counts
    })

    await page.goto('/')
    const watched = ['orientationchange', 'pagehide', 'pageshow', 'visibilitychange']
    const counts = () => page.evaluate((types) => Object.fromEntries(types.map((type) => [type, window.__listenerCounts[type] || 0])), watched)
    const baseline = await counts()

    for (let i = 0; i < 6; i += 1) {
      await page.goto('/map')
      await expect(page.getByTestId('map-engine')).toHaveCount(1)
      await page.goto('/')
      await expect(page.getByTestId('map-engine')).toHaveCount(0)
    }
    expect(await counts()).toEqual(baseline)

    await page.goto('/map')
    const surface = page.getByTestId('map-surface')
    await expect(surface).toBeVisible()
    const before = Number(await surface.getAttribute('data-update-count'))
    await surface.evaluate((el) => {
      for (let i = 0; i < 120; i += 1) {
        el.dispatchEvent(new WheelEvent('wheel', { deltaY: i % 2 ? -80 : 80, bubbles: true, cancelable: true }))
      }
    })
    await page.waitForTimeout(120)
    const after = Number(await surface.getAttribute('data-update-count'))
    expect(after - before).toBeLessThanOrEqual(30)
    expect(errors).toEqual([])
  })
})
