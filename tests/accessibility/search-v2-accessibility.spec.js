import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

async function openSearch(page){
  await page.goto('/Movera-host1/')
  const trigger=page.getByTestId('home-search')
  await trigger.focus()
  await trigger.click()
  await expect(page.getByRole('dialog', {name:'Destination'})).toBeVisible()
}

async function runAxe(page){
  const results=await new AxeBuilder({page}).include('.search-v2').analyze()
  expect(results.violations, JSON.stringify(results.violations,null,2)).toEqual([])
}

test.describe('Search V2 accessibility',()=>{
  test('destination step has no Axe violations',async({page})=>{
    await openSearch(page)
    await runAxe(page)
  })

  test('dates step has no Axe violations',async({page})=>{
    await openSearch(page)
    await page.getByRole('button',{name:'Sidi Bou Saïd'}).click()
    await page.getByRole('button',{name:'Continuer'}).click()
    await expect(page.getByRole('dialog',{name:'Dates'})).toBeVisible()
    await runAxe(page)
  })

  test('travellers step has no Axe violations',async({page})=>{
    await openSearch(page)
    await page.getByRole('button',{name:'Sidi Bou Saïd'}).click()
    await page.getByRole('button',{name:'Continuer'}).click()
    const enabledDays=page.locator('.premium-calendar__grid button:not([disabled])')
    await enabledDays.nth(2).click()
    await enabledDays.nth(5).click()
    await page.getByRole('button',{name:'Continuer'}).click()
    await expect(page.getByRole('dialog',{name:'Voyageurs'})).toBeVisible()
    await runAxe(page)
  })

  test('keyboard focus stays inside dialog and returns to trigger',async({page})=>{
    await openSearch(page)
    const dialog=page.getByRole('dialog')
    for(let i=0;i<12;i++){
      await page.keyboard.press('Tab')
      const inside=await page.evaluate(()=>document.querySelector('.search-v2__panel')?.contains(document.activeElement))
      expect(inside).toBeTruthy()
    }
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(page.getByTestId('home-search')).toBeFocused()
  })

  test('interactive targets meet minimum touch size',async({page})=>{
    await openSearch(page)
    const tooSmall=await page.locator('.search-v2 button:visible').evaluateAll(nodes=>nodes.filter(node=>{
      const rect=node.getBoundingClientRect()
      return rect.width<44 || rect.height<44
    }).map(node=>({text:node.textContent?.trim(),label:node.getAttribute('aria-label'),width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height})))
    expect(tooSmall).toEqual([])
  })

  test('reduced motion disables meaningful transitions',async({browser})=>{
    const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}})
    const page=await context.newPage()
    await openSearch(page)
    const duration=await page.locator('.search-v2__panel').evaluate(node=>getComputedStyle(node).transitionDuration)
    expect(duration==='0s' || duration==='0.00001s' || duration==='0.001s').toBeTruthy()
    await context.close()
  })
})
