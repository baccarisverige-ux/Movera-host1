import { listingCatalog } from '../../entities/listing/listingCatalog.js'
import { CollectionPage } from '../../shared/collection/CollectionPage.jsx'

const BEACH_OFFERS = listingCatalog.filter((item) => item.category.split(' ').includes('beach'))

export function BeachPage({ onNavigate }) {
  return (
    <CollectionPage
      onNavigate={onNavigate}
      offers={BEACH_OFFERS}
      hero={{
        src: '/Movera-host1/assets/plage-page-hero.jpeg?v=pure-white',
        alt: 'Collection Plage Movera',
        testId: 'page-beach',
      }}
      collectionLabel="Collection Plage"
      title={<>La Tunisie<br/>côté mer.</>}
      description="Des adresses choisies pour vivre la côte autrement."
      allResultsLabel="Tous les séjours Plage"
      emptyTitle="Pas encore d’adresse Plage ici."
      badgeLabel="Plage"
    />
  )
}
