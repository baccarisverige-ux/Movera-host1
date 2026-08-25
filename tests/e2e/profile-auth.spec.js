import { expect, test } from '@playwright/test'

const AUTH_SESSION_KEY = 'movera:auth-session:v1'

test('protected messages sends guest to profile and email login returns to messages', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/messages')

  await expect(page.getByTestId('page-auth-required')).toBeVisible()
  await page.getByRole('button', { name: 'Se connecter' }).click()

  await expect(page.getByTestId('page-profile')).toBeVisible()
  await expect(page).toHaveURL(/\/profile\?returnTo=%2Fmessages$/)
  await expect(page.getByRole('button', { name: 'Continuer avec Apple' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Continuer avec Google' })).toBeVisible()

  await page.getByLabel('Adresse e-mail').fill('voyageur@movera.tn')
  await page.getByLabel('Mot de passe').fill('movera123')
  await page.getByRole('button', { name: 'Se connecter' }).click()

  await expect(page.getByTestId('page-messages')).toBeVisible()
  await expect(page).toHaveURL(/\/messages$/)

  const nav = page.locator('.app-shell--guest > .app-shell__nav')
  await expect(nav.locator('.app-shell__nav-item', { hasText: 'Messages' })).not.toHaveAttribute('aria-disabled', 'true')

  const stored = await page.evaluate((key) => window.localStorage.getItem(key), AUTH_SESSION_KEY)
  expect(stored).toContain('voyageur@movera.tn')
  expect(stored).not.toContain('movera123')
})

test('phone login opens connected profile and logout locks private modules again', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/Movera-host1/profile')

  await expect(page.getByTestId('page-profile')).toBeVisible()
  await page.getByRole('tab', { name: 'Téléphone' }).click()
  await page.getByLabel('Numéro de téléphone').fill('+216 20 123 456')
  await page.getByLabel('Mot de passe').fill('secret7')
  await page.getByRole('button', { name: 'Se connecter' }).click()

  await expect(page.getByText('Session Movera active')).toBeVisible()
  await expect(page.getByText('+21620123456')).toBeVisible()

  const nav = page.locator('.app-shell--guest > .app-shell__nav')
  await expect(nav.locator('.app-shell__nav-item', { hasText: 'Messages' })).not.toHaveAttribute('aria-disabled', 'true')
  await expect(nav.locator('.app-shell__nav-item[data-active="true"] span')).toHaveText('Profil')

  await page.getByRole('button', { name: 'Se déconnecter' }).click()
  await expect(page.getByRole('heading', { level: 1, name: /Votre compte/ })).toBeVisible()
  await expect(nav.locator('.app-shell__nav-item', { hasText: 'Messages' })).toHaveAttribute('aria-disabled', 'true')
})
