import { listingCatalog } from '../../entities/listing/listingCatalog.js'
import { CollectionPage } from '../../shared/collection/CollectionPage.jsx'
import '../../shared/collection/portrait-collection.css'
import HERO_IMAGE_DATA from './assets/hero-mini.b64?raw'

const APARTMENT_OFFERS = listingCatalog.filter((item) => item.category.split(' ').includes('family'))
const HERO_IMAGE = `data:image/jpeg;base64,${HERO_IMAGE_DATA.trim()}`

export function ApartmentPage() {
  return (
    <CollectionPage
      offers={APARTMENT_OFFERS}
      pageClassName="portrait-collection-page"
      hero={{
        src: HERO_IMAGE,
        alt: 'Collection Appartement Movera',
        className: 'portrait-collection-hero__image',
        testId: 'page-apartment',
      }}
      collectionLabel="Collection Appartement"
      title={<>Votre séjour,<br/>comme chez vous.</>}
      description="Des appartements sélectionnés pour leur confort, leur emplacement et leur qualité d’accueil."
      allResultsLabel="Tous les appartements"
      emptyTitle="Pas encore d’appartement ici."
      badgeLabel="Appartement"
    />
  )
}
