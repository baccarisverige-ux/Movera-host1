import { useMemo, useState } from 'react'
import { homeCategories, homeDestinations, homeFavorites, homeFeatured } from '../../mocks/homeData'

function ListingCard({ item, onOpen }) {
  return (
    <article className="home-card" data-testid={`home-card-${item.id}`}>
      <div className="home-card__media" aria-hidden="true" />
      <div className="home-card__body">
        <div>
          <p className="home-card__location">{item.location}</p>
          <h3>{item.title}</h3>
        </div>
        {item.badge ? <span className="home-card__badge">{item.badge}</span> : null}
        <p className="home-card__price"><strong>{item.price} {item.currency}</strong> / nuit</p>
        <button type="button" className="home-card__action" onClick={() => onOpen(item.id)}>Voir l’offre</button>
      </div>
    </article>
  )
}

export function HomePage({ onNavigate }) {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const featured = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return homeFeatured.filter((item) => {
      const categoryMatch = category === 'all' || item.category === category
      const queryMatch = !normalizedQuery || `${item.title} ${item.location}`.toLowerCase().includes(normalizedQuery)
      return categoryMatch && queryMatch
    })
  }, [category, query])

  return (
    <div className="home-page" data-testid="page-home">
      <section className="home-hero" aria-labelledby="home-title">
        <p className="home-eyebrow">Movera Host</p>
        <h1 id="home-title">Trouvez votre prochain séjour</h1>
        <p>Des adresses sélectionnées en Tunisie, simplement.</p>
        <label className="home-search">
          <span className="sr-only">Rechercher une destination</span>
          <input
            data-testid="home-search"
            type="search"
            placeholder="Destination, logement…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </section>

      <section className="home-section" aria-labelledby="categories-title">
        <div className="home-section__heading"><h2 id="categories-title">Explorer</h2></div>
        <div className="home-categories" data-testid="home-categories">
          {homeCategories.map((item) => (
            <button
              key={item.id}
              type="button"
              className="home-category"
              data-active={category === item.id ? 'true' : 'false'}
              onClick={() => setCategory(item.id)}
            >{item.label}</button>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="featured-title">
        <div className="home-section__heading"><h2 id="featured-title">Sélection Movera</h2><span>{featured.length} offre{featured.length === 1 ? '' : 's'}</span></div>
        <div className="home-card-grid" data-testid="home-featured">
          {featured.length ? featured.map((item) => <ListingCard key={item.id} item={item} onOpen={(id) => onNavigate(`/listing/${id}`)} />) : <p className="home-empty">Aucune offre pour cette sélection.</p>}
        </div>
      </section>

      <section className="home-section" aria-labelledby="favorite-title">
        <div className="home-section__heading"><h2 id="favorite-title">Coup de cœur</h2></div>
        <div className="home-card-grid home-card-grid--compact" data-testid="home-favorites">
          {homeFavorites.map((item) => <ListingCard key={item.id} item={item} onOpen={(id) => onNavigate(`/listing/${id}`)} />)}
        </div>
      </section>

      <section className="home-section" aria-labelledby="destinations-title">
        <div className="home-section__heading"><h2 id="destinations-title">Destinations privilégiées</h2></div>
        <div className="home-destinations" data-testid="home-destinations">
          {homeDestinations.map((item) => (
            <button key={item.id} type="button" className="home-destination" onClick={() => onNavigate(`/map?destination=${item.id}`)}>
              <strong>{item.label}</strong><span>{item.subtitle}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-map-cta" data-testid="home-map-cta">
        <div><p className="home-eyebrow">Explorer autrement</p><h2>Voir les logements sur la carte</h2></div>
        <button type="button" onClick={() => onNavigate('/map')}>Explorer la carte</button>
      </section>
    </div>
  )
}
