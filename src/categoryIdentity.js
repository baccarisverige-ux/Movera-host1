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

let scheduled = false

function getCategoryLabel(button) {
  return Array.from(button.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent || '')
    .join('')
    .trim()
}

function ensureRealCategoryIcon(button, id) {
  const src = CATEGORY_ICON_BY_ID[id]
  if (!src) return

  button.dataset.categoryId = id

  const directImages = Array.from(button.querySelectorAll(':scope > img'))
  let icon = directImages.find((image) => image.dataset.categoryIcon === id) || null

  if (!icon) {
    icon = document.createElement('img')
    icon.dataset.categoryIcon = id
    icon.alt = ''
    icon.setAttribute('aria-hidden', 'true')
    icon.decoding = 'async'
    button.prepend(icon)
  }

  if (icon.getAttribute('src') !== src) icon.setAttribute('src', src)

  directImages.forEach((image) => {
    if (image !== icon) image.dataset.legacyCategoryIcon = 'true'
  })

  button.querySelectorAll(':scope > span[aria-hidden="true"]').forEach((span) => {
    span.dataset.legacyCategoryIcon = 'true'
  })
}

function applyCategoryIdentity() {
  const categories = document.querySelector('.b225-categories')
  if (!categories) return

  categories.querySelectorAll(':scope > button').forEach((button) => {
    const label = getCategoryLabel(button)
    const id = CATEGORY_IDS_BY_LABEL.get(label)
    if (!id) return

    button.dataset.categoryId = id
    ensureRealCategoryIcon(button, id)
  })
}

function scheduleApply() {
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(() => {
    scheduled = false
    applyCategoryIdentity()
  })
}

scheduleApply()

const observer = new MutationObserver(scheduleApply)
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
})
