import { expect, test } from '@playwright/test'

const HOST_PROFILES_KEY = 'movera:host-profiles:v1'
const HOST_CALENDAR_KEY = 'movera:host-calendar:v1'

async function clearHostState(page) {
  await page.evaluate(([profilesKey, calendarKey]) => {
    window.localStorage.removeItem(profilesKey)
    window.localStorage.removeItem(calendarKey)
  }, [HOST_PROFILES_KEY, HOST_CALENDAR_KEY])
}

test('first-time traveler becomes a host before reaching the B225-derived calendar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/profile')
  await page.getByTestId('profile-test-login').click()
  await expect(page.getByTestId('switch-to-hosting')).toContainText('Devenir hôte')

  await clearHostState(page)
  await page.reload()
  await expect(page.getByTestId('switch-to-hosting')).toContainText('Devenir hôte')
  await page.getByTestId('switch-to-hosting').click()

  await expect(page).toHaveURL(/\/host$/)
  await expect(page.getByTestId('host-onboarding')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Devenir hôte avec Movera.' })).toBeVisible()
  await expect(page.locator('.app-shell__nav')).toHaveCount(0)

  await page.getByRole('button', { name: 'Commencer' }).click()
  await page.getByLabel('Nom du logement').fill('Villa Saphir — Front de mer')
  await page.getByLabel('Ville du logement').fill('La Marsa')
  await page.getByRole('radio', { name: 'Villa' }).click()
  await page.getByRole('button', { name: 'Continuer' }).click()

  await page.getByLabel('Prix par nuit').fill('220')
  await page.getByRole('button', { name: 'Continuer' }).click()
  await page.locator('.host-onboarding__check input').nth(0).check()
  await page.locator('.host-onboarding__check input').nth(1).check()
  await page.getByRole('button', { name: 'Activer mon espace Hôte' }).click()

  const calendarPage = page.getByTestId('host-calendar-page')
  await expect(calendarPage).toBeVisible()
  await expect(calendarPage).toContainText('Villa Saphir — Front de mer')
  await expect(calendarPage).toContainText('220 TND')
  await expect(page.locator('.host-calendar__dow')).toHaveCount(7)

  const hostProfile = await page.evaluate((key) => window.localStorage.getItem(key), HOST_PROFILES_KEY)
  expect(hostProfile).toContain('Villa Saphir')
  expect(hostProfile).toContain('"status":"active"')
})

test('host calendar supports month navigation, day pricing, blocking and booking detail', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/profile')
  await page.getByTestId('profile-test-login').click()

  await page.evaluate(([profilesKey, calendarKey]) => {
    const userId = 'movera-demo-user'
    window.localStorage.setItem(profilesKey, JSON.stringify({
      [userId]: {
        status: 'active',
        userId,
        createdAt: new Date().toISOString(),
        listing: { id: 'primary-listing', name: 'Villa Saphir — Front de mer', city: 'La Marsa', type: 'Villa', basePrice: 220, currency: 'TND' },
      },
    }))
    window.localStorage.removeItem(calendarKey)
  }, [HOST_PROFILES_KEY, HOST_CALENDAR_KEY])

  await page.goto('/Movera-host1/host/calendar')
  const calendarPage = page.getByTestId('host-calendar-page')
  await expect(calendarPage).toBeVisible()

  const monthTitle = page.locator('.host-calendar__monthbar strong')
  const before = await monthTitle.innerText()
  await page.getByRole('button', { name: 'Mois suivant' }).click()
  await expect(monthTitle).not.toHaveText(before)
  await page.getByRole('button', { name: 'Aujourd’hui' }).click()

  const freeDay = page.locator('[data-calendar-day="9"]')
  await freeDay.click()
  const editor = page.getByTestId('host-day-editor')
  await expect(editor).toBeVisible()
  await page.getByLabel('Prix des dates sélectionnées').fill('250')
  await editor.getByRole('button', { name: 'Bloqué' }).click()
  await editor.getByRole('button', { name: 'Appliquer' }).click()
  await expect(freeDay.locator('.host-calendar__price')).toHaveText('—')

  const persisted = await page.evaluate((key) => window.localStorage.getItem(key), HOST_CALENDAR_KEY)
  expect(persisted).toContain('250')
  expect(persisted).toContain('"blocked":true')

  await page.reload()
  await expect(page.locator('[data-calendar-day="9"] .host-calendar__price')).toHaveText('—')

  await page.locator('[data-calendar-day="4"]').click()
  const bookingSheet = page.getByTestId('host-booking-sheet')
  await expect(bookingSheet).toBeVisible()
  await expect(bookingSheet).toContainText('Bilel Ben Ali')
  await expect(bookingSheet).toContainText('1 260 TND')
})

test('existing host sees direct host access in profile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/profile')
  await page.getByTestId('profile-test-login').click()
  await page.evaluate((key) => {
    const userId = 'movera-demo-user'
    window.localStorage.setItem(key, JSON.stringify({
      [userId]: {
        status: 'active',
        userId,
        createdAt: new Date().toISOString(),
        listing: { id: 'primary-listing', name: 'Dar Movera', city: 'Tunis', type: 'Appartement', basePrice: 180, currency: 'TND' },
      },
    }))
    window.dispatchEvent(new StorageEvent('storage', { key }))
  }, HOST_PROFILES_KEY)

  await expect(page.getByTestId('switch-to-hosting')).toContainText('Ouvrir l’espace Hôte')
  await page.getByTestId('switch-to-hosting').click()
  await expect(page.getByTestId('host-calendar-page')).toBeVisible()
  await expect(page.getByTestId('host-calendar-page')).toContainText('Dar Movera')
})
