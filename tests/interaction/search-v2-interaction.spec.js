import { expect, test } from '@playwright/test'

async function openSearch(page){
  await page.goto('/Movera-host1/')
  const trigger=page.getByTestId('home-search')
  await expect(trigger).toBeVisible()
  await trigger.click()
  await expect(page.getByRole('dialog',{name:'Recherche Movera'})).toBeVisible()
}

async function chooseDestination(page){
  await page.getByRole('button',{name:'La Marsa'}).click()
  await page.getByRole('button',{name:'Continuer'}).click()
  await expect(page.getByText('Choisissez vos dates')).toBeVisible()
}

async function chooseDates(page){
  const enabled=page.locator('.premium-calendar__grid button:not([disabled])')
  await enabled.nth(7).click()
  await enabled.nth(10).click()
  await page.getByRole('button',{name:'Continuer'}).click()
  await expect(page.getByText('Ajoutez les voyageurs')).toBeVisible()
}

test.describe('Search V2 interaction QA',()=>{
  test('Escape closes and restores focus to search trigger',async({page})=>{
    await openSearch(page)
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog',{name:'Recherche Movera'})).toBeHidden()
    await expect(page.getByTestId('home-search')).toBeFocused()
  })

  test('Tab focus stays inside the open dialog',async({page})=>{
    await openSearch(page)
    const dialog=page.getByRole('dialog',{name:'Recherche Movera'})
    for(let i=0;i<18;i++){
      await page.keyboard.press('Tab')
      await expect(dialog).toContainText('Planifier votre séjour')
      const inside=await page.evaluate(()=>Boolean(document.activeElement?.closest('.search-v2__panel')))
      expect(inside).toBeTruthy()
    }
  })

  test('backdrop and close button can be used repeatedly without blocking the page',async({page})=>{
    for(let i=0;i<3;i++){
      await openSearch(page)
      if(i%2===0) await page.getByRole('button',{name:'Fermer',exact:true}).click()
      else await page.getByRole('button',{name:'Fermer la recherche'}).click({position:{x:2,y:2}})
      await expect(page.getByRole('dialog',{name:'Recherche Movera'})).toBeHidden()
      await expect(page.getByTestId('home-search')).toBeEnabled()
    }
  })

  test('rapid step changes and return preserve a usable state',async({page})=>{
    await openSearch(page)
    await page.getByRole('button',{name:'Sidi Bou Saïd'}).dblclick()
    await expect(page.getByRole('button',{name:'Continuer'})).toBeEnabled()
    await page.getByRole('button',{name:'Continuer'}).click()
    await expect(page.getByText('Choisissez vos dates')).toBeVisible()
    await page.getByRole('button',{name:'Retour'}).click()
    await expect(page.getByText('Trouvez votre destination')).toBeVisible()
    await expect(page.getByRole('button',{name:'Sidi Bou Saïd'})).toHaveAttribute('data-active','true')
  })

  test('calendar month navigation and range selection remain interactive',async({page})=>{
    await openSearch(page)
    await chooseDestination(page)
    const title=page.locator('.premium-calendar__toolbar > strong')
    const initial=await title.textContent()
    await page.getByRole('button',{name:'Mois suivant'}).click()
    await expect(title).not.toHaveText(initial||'')
    await page.getByRole('button',{name:'Mois précédent'}).click()
    await expect(title).toHaveText(initial||'')
    const enabled=page.locator('.premium-calendar__grid button:not([disabled])')
    await enabled.nth(7).click()
    await enabled.nth(10).click()
    await expect(page.locator('[data-edge="arrival"]')).toHaveCount(1)
    await expect(page.locator('[data-edge="departure"]')).toHaveCount(1)
  })

  test('guest counters handle repeated taps and CTA remains visible',async({page})=>{
    await openSearch(page)
    await chooseDestination(page)
    await chooseDates(page)
    const addChild=page.getByRole('button',{name:'Augmenter Enfants'})
    await addChild.click({clickCount:3,delay:35})
    await expect(page.getByText('5 voyageurs')).toBeVisible()
    const cta=page.getByRole('button',{name:'Afficher sur la carte'})
    await expect(cta).toBeVisible()
    const box=await cta.boundingBox()
    expect(box).toBeTruthy()
    expect(box.y+box.height).toBeLessThanOrEqual((await page.viewportSize()).height)
  })

  test('scroll and short viewport never hide the footer CTA',async({page})=>{
    await page.setViewportSize({width:390,height:620})
    await openSearch(page)
    await chooseDestination(page)
    const content=page.locator('.search-v2__content')
    await content.hover()
    await page.mouse.wheel(0,900)
    const cta=page.getByRole('button',{name:'Continuer'})
    await expect(cta).toBeVisible()
    const box=await cta.boundingBox()
    expect(box.y+box.height).toBeLessThanOrEqual(620)
  })

  test('orientation-style viewport change keeps dialog operational',async({page})=>{
    await page.setViewportSize({width:390,height:844})
    await openSearch(page)
    await page.setViewportSize({width:844,height:390})
    await expect(page.getByRole('dialog',{name:'Recherche Movera'})).toBeVisible()
    await expect(page.getByRole('button',{name:'Continuer'})).toBeVisible()
    await page.setViewportSize({width:390,height:844})
    await expect(page.getByRole('dialog',{name:'Recherche Movera'})).toBeVisible()
  })
})
