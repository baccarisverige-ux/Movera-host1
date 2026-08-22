import { listingCatalog } from '../../entities/listing/listingCatalog.js'
import { CollectionPage } from '../../shared/collection/CollectionPage.jsx'
import '../../shared/collection/portrait-collection.css'

const GUESTHOUSE_OFFERS = listingCatalog.filter((item) => item.category.split(' ').includes('guesthouse'))

export function GuestHousePage() {
  return (
    <CollectionPage
      offers={GUESTHOUSE_OFFERS}
      pageClassName="portrait-collection-page"
      hero={{
        src: '/Movera-host1/assets/guesthouse-page-hero.jpeg',
        alt: 'Maison d’hôte Movera',
        className: 'portrait-collection-hero__image',
        testId: 'page-guesthouse',
      }}
      collectionLabel="Collection Maison d’hôte"
      title={<>L’accueil tunisien,<br/>autrement.</>}
      description="Des maisons de caractère choisies pour leur charme et leur hospitalité."
      allResultsLabel="Toutes les maisons d’hôte"
      emptyTitle="Pas encore de maison d’hôte ici."
      badgeLabel="Maison d’hôte"
    />
  )
}
