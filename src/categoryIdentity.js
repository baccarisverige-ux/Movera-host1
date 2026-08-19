const CATEGORY_IDS_BY_LABEL = new Map([
  ['Tout', 'all'],
  ['Maison d’hôte', 'guesthouse'],
  ['Plage', 'beach'],
  ['Famille', 'family'],
  ['Prestige', 'prestige'],
  ['Expérience', 'experience'],
  ['Partenaire', 'partner'],
])

function applyCategoryIds(root = document) {
  const categories = root.querySelector?.('.b225-categories')
  if (!categories) return false

  categories.querySelectorAll('button').forEach((button) => {
    const label = button.textContent?.trim()
    const id = CATEGORY_IDS_BY_LABEL.get(label)
    if (id) button.dataset.categoryId = id
  })

  return true
}

if (!applyCategoryIds()) {
  const observer = new MutationObserver(() => {
    if (applyCategoryIds()) observer.disconnect()
  })
  observer.observe(document.documentElement, { childList: true, subtree: true })
}
