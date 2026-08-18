import { useMemo, useState } from 'react'
import { homeCategories, homeCollections, homeDestinations, homeFeatured, homeServices } from '../../mocks/homeData'
import '../../styles/home-b225.css'
import '../../styles/home-b225-block2.css'

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
}

function ListingCard({ item, onOpen, featured = false }) {
  return (
    <article className={`b225-card${featured ? ' b225-featured-card' : ''}`} data-testid={`home-card-${item.id}`} onClick={() => onOpen(item.id)}>
      <div className="b225-card__image">
        <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
        {item.badge ? <span className="b225-card__badge">{item.badge}</span> : null}
        <button type="button" className="b225-card__heart" aria-label={`Ajouter ${item.title} aux favoris`} onClick={(event) => event.stopPropagation()}>♡</button>
      </div>
      <div className="b225-card__body">
        {featured ? (
          <p className="b225-featured-line"><strong>{item.title}</strong><span> — {item.price} {item.currency}</span></p>
        ) : (
          <>
            <div className="b225-card__topline"><h3>{item.title}</h3><span>★ {item.rating || '4.90'}</span></div>
            <p>{item.location} · Tunisie</p>
            <p className="b225-card__price"><strong>{item.price} {item.currency}</strong> <span>/ nuit</span></p>
          </>
        )}
      </div>
    </article>
  )
}

function Collection({ title, items, onOpen }) {
  return (
    <section className="b225-section">
      <div className="b225-section__title"><h2>{title}</h2><button type="button" aria-label={`Voir ${title}`}><ArrowIcon /></button></div>
      <div className="b225-scroll">
        {items.map((item) => <ListingCard key={`${title}-${item.id}`} item={item} onOpen={onOpen} />)}
      </div>
    </section>
  )
}

export function HomePage({ onNavigate }) {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const featured = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return homeFeatured.filter((item) => {
      const categoryMatch = category === 'all' || item.category.split(' ').includes(category)
      const queryMatch = !normalizedQuery || `${item.title} ${item.location}`.toLowerCase().includes(normalizedQuery)
      return categoryMatch && queryMatch
    })
  }, [category, query])

  const openListing = (id) => onNavigate(`/listing/${id}`)

  return (
    <div className="b225-home" data-testid="page-home">
      <header className="b225-home-header">
        <div className="b225-brand">Movera Host</div>
        <label className="b225-search" aria-label="Rechercher une destination">
          <SearchIcon />
          <span className="b225-search__copy">
            <strong>Où allez-vous ?</strong>
            <span>Destination · Dates · Voyageurs</span>
          </span>
          <input data-testid="home-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Destination" />
          <button type="button" className="b225-ai" aria-label="Assistant IA" onClick={() => onNavigate('/messages')}>✦</button>
        </label>
      </header>

      <div className="b225-categories" data-testid="home-categories">
        {homeCategories.map((item) => (
          <button key={item.id} type="button" data-active={category === item.id ? 'true' : 'false'} onClick={() => setCategory(item.id)}>
            <span aria-hidden="true">{item.icon}</span>{item.label}
          </button>
        ))}
      </div>

      <section className="b225-welcome" aria-label="Bienvenue chez Movera">
        <div>
          <span>Bienvenue chez Movera</span>
          <div className="b225-signs">
            <button type="button" onClick={() => onNavigate('/map?destination=sidi-bou-said')}>Sidi Bou Saïd</button>
            <button type="button" onClick={() => onNavigate('/map?destination=sousse')}>Sousse</button>
            <button type="button" onClick={() => onNavigate('/map?destination=hammamet')}>Hammamet</button>
          </div>
        </div>
        <div className="b225-welcome__visual" aria-hidden="true"><span>MH</span></div>
      </section>

      <section className="b225-section b225-featured-section" data-testid="home-featured">
        <div className="b225-section__title"><h2>Sélection d'Exception</h2></div>
        <div className="b225-scroll b225-featured-scroll">
          {featured.length ? featured.map((item) => <ListingCard key={item.id} item={item} onOpen={openListing} featured />) : <p className="b225-empty">Aucune offre pour cette sélection.</p>}
        </div>
      </section>

      <section className="b225-section b225-destinations-section" data-testid="home-destinations">
        <div className="b225-section__title"><h2>Destinations Privilégiées</h2></div>
        <div className="b225-cities">
          {homeDestinations.map((item, index) => (
            <button key={item.id} type="button" className="b225-city" onClick={() => onNavigate(`/map?destination=${item.id}`)}>
              <span className="b225-city__image"><img src={item.image} alt={item.label} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" /></span>
              <span className="b225-city__copy"><strong>{item.label}</strong><span>{item.subtitle}</span></span>
            </button>
          ))}
        </div>
      </section>

      <section className="b225-services" aria-label="Services Movera" data-testid="home-services">
        {homeServices.map((service) => (
          <button type="button" key={service.id} className="b225-service-card">
            <span className="b225-service-visual" aria-hidden="true">{service.symbol}</span>
            <strong>{service.label}</strong>
          </button>
        ))}
      </section>

      {homeCollections.map((collection) => <Collection key={collection.id} title={collection.title} items={collection.items} onOpen={openListing} />)}

      <section className="b225-section b225-experiences">
        <div className="b225-section__title"><h2>Expériences Exclusives</h2></div>
        <div className="b225-experience-grid">
          <button type="button"><span>✦</span><strong>Table privée</strong><small>Expérience locale sélectionnée</small></button>
          <button type="button"><span>◌</span><strong>Escapade mer</strong><small>Moments exclusifs en Tunisie</small></button>
        </div>
      </section>

      <button className="b225-map-cta" data-testid="home-map-cta" type="button" onClick={() => onNavigate('/map')}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/></svg>
        Explorer la carte
      </button>
    </div>
  )
}
