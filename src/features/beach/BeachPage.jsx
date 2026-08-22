import { listingCatalog } from '../../entities/listing/listingCatalog.js'
import { CollectionPage } from '../../shared/collection/CollectionPage.jsx'
import '../../shared/collection/portrait-collection.css'

const BEACH_OFFERS = listingCatalog.filter((item) => item.category.split(' ').includes('beach'))

export function BeachPage() {
  return (
    <CollectionPage
      offers={BEACH_OFFERS}
      pageClassName="portrait-collection-page"
      hero={{
        src: '/Movera-host1/assets/plage-page-hero.webp',
        alt: 'Collection Plage Movera',
        className: 'portrait-collection-hero__image',
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
