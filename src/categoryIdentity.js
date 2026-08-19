const CATEGORY_IDS_BY_LABEL = new Map([
  ['Tout', 'all'],
  ['Maison d’hôte', 'guesthouse'],
  ['Plage', 'beach'],
  ['Famille', 'family'],
  ['Prestige', 'prestige'],
  ['Expérience', 'experience'],
  ['Partenaire', 'partner'],
])

const CATEGORY_ICON_BY_ID = {
  prestige: '/Movera-host1/assets/prestige-star.png',
  experience: '/Movera-host1/assets/prestige-category.webp',
  partner: '/Movera-host1/assets/partner-category.png',
}

function ensureRealCategoryIcon(button, id) {
  const src = CATEGORY_ICON_BY_ID[id]
  if (!src) return

  let icon = button.querySelector(':scope > img[data-category-icon]')
  if (!icon) {
    icon = document.createElement('img')
    icon.dataset.categoryIcon = id
    icon.alt = ''
    icon.setAttribute('aria-hidden', 'true')
    icon.decoding = 'async'
    button.prepend(icon)
  }

  if (icon.getAttribute('src') !== src) icon.setAttribute('src', src)

  button.querySelectorAll(':scope > span[aria-hidden="true"]').forEach((span) => {
    span.dataset.legacyCategoryIcon = 'true'
  })
}

function applyCategoryIds(root = document) {
  const categories = root.querySelector?.('.b225-categories')
  if (!categories) return false

  categories.querySelectorAll('button').forEach((button) => {
    const label = button.textContent?.trim()
    const id = CATEGORY_IDS_BY_LABEL.get(label)
    if (!id) return

    button.dataset.categoryId = id
    ensureRealCategoryIcon(button, id)
  })

  return true
}

if (!applyCategoryIds()) {
  const observer = new MutationObserver(() => {
    if (applyCategoryIds()) observer.disconnect()
  })
  observer.observe(document.documentElement, { childList: true, subtree: true })
}
