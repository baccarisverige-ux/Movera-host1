import { useMemo, useState } from 'react'
import { homeFeatured } from '../../mocks/homeData.js'
import './beach-page.css'
import './beach-page-scale.css'

const QUICK_CITIES = ['Toutes', 'Gammarth', 'La Marsa', 'Hammamet', 'Sousse', 'Djerba', 'Bizerte', 'Nabeul']

const TUNISIA_CITIES = [
  'Ajim', 'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Carthage', 'Djerba', 'Douz',
  'El Jem', 'Ezzahra', 'Gabès', 'Gafsa', 'Gammarth', 'Ghar El Melh', 'Hammam Lif',
  'Hammamet', 'Haouaria', 'Houmt Souk', 'Jendouba', 'Kairouan', 'Kasserine',
  'Kébili', 'Kélibia', 'Kerkennah', 'Korba', 'Ksar Hellal', 'La Goulette',
  'La Marsa', 'La Soukra', 'Le Kef', 'Le Kram', 'Mahdia', 'Manouba', 'Médenine',
  'Menzel Bourguiba', 'Menzel Temime', 'Midoun', 'Moknine', 'Monastir', 'Mornag',
  'Nabeul', 'Nefta', 'Port El Kantaoui', 'Rades', 'Raf Raf', 'Raoued',
  'Sfax', 'Sidi Bou Saïd', 'Sidi Bouzid', 'Siliana', 'Soliman', 'Sousse',
  'Tabarka', 'Tataouine', 'Tozeur', 'Tunis', 'Yasmine Hammamet', 'Zaghouan', 'Zarzis'
]

const normalize = (value = '') => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
}

function PinIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.3"/></svg>
}

function BackIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
}

function HeartIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.8a5.3 5.3 0 0 0-7.5 0L12 6.1l-1.3-1.3a5.3 5.3 0 0 0-7.5 7.5L12 21l8.8-8.7a5.3 5.3 0 0 0 0-7.5Z"/></svg>
}

export function BeachPage({ onNavigate }) {
  const [cityQuery, setCityQuery] = useState('')
  const [city, setCity] = useState('')
  const [focused, setFocused] = useState(false)

  const beachOffers = useMemo(
    () => homeFeatured.filter((item) => item.category.split(' ').includes('beach')),
    []
  )

  const suggestions = useMemo(() => {
    const q = normalize(cityQuery)
    if (!q) return TUNISIA_CITIES.slice(0, 6)
    return TUNISIA_CITIES
      .filter((name) => normalize(name).includes(q))
      .sort((a, b) => {
        const aStarts = normalize(a).startsWith(q) ? 0 : 1
        const bStarts = normalize(b).startsWith(q) ? 0 : 1
        return aStarts - bStarts || a.localeCompare(b, 'fr')
      })
      .slice(0, 7)
  }, [cityQuery])

  const visibleOffers = useMemo(() => {
    const filterCity = normalize(city || cityQuery)
    if (!filterCity) return beachOffers
    return beachOffers.filter((item) => normalize(item.location).includes(filterCity))
  }, [beachOffers, city, cityQuery])

  const selectCity = (value) => {
    if (value === 'Toutes') {
      setCity('')
      setCityQuery('')
      setFocused(false)
      return
    }
    setCity(value)
    setCityQuery(value)
    setFocused(false)
  }

  const onCityChange = (event) => {
    const value = event.target.value
    setCityQuery(value)
    const exact = TUNISIA_CITIES.find((name) => normalize(name) === normalize(value))
    setCity(exact || '')
  }

  return (
    <div className="beach-page" data-testid="page-beach">
      <section className="beach-hero" aria-label="Collection Plage">
        <img className="beach-hero__image" src="/Movera-host1/assets/plage-page-hero.jpeg" alt="Collection Plage Movera" decoding="async" fetchPriority="high" />
        <div className="beach-hero__veil" />
        <div className="beach-hero__top">
          <button className="beach-glass-button" type="button" aria-label="Retour à l’accueil" onClick={() => onNavigate('/')}>
            <BackIcon />
          </button>
          <span className="beach-hero__brand">Movera Host</span>
          <span className="beach-hero__counter">{beachOffers.length} séjours</span>
        </div>
        <div className="beach-hero__copy">
          <span>Collection Plage</span>
          <h1>La Tunisie<br/>côté mer.</h1>
          <p>Des adresses choisies pour vivre la côte autrement.</p>
        </div>
      </section>

      <section className="beach-discovery" aria-label="Choisir une ville">
        <div className={`beach-city-search${focused ? ' is-focused' : ''}`}>
          <PinIcon />
          <label>
            <span>Où souhaitez-vous aller ?</span>
            <input
              type="text"
              value={cityQuery}
              placeholder="Écrivez une ville"
              autoComplete="off"
              inputMode="search"
              aria-label="Ville en Tunisie"
              onFocus={() => setFocused(true)}
              onChange={onCityChange}
            />
          </label>
          {cityQuery ? (
            <button className="beach-city-search__clear" type="button" aria-label="Effacer la ville" onClick={() => selectCity('Toutes')}>×</button>
          ) : <SearchIcon />}
          {focused && suggestions.length > 0 ? (
            <div className="beach-city-suggestions" role="listbox" aria-label="Villes suggérées">
              {suggestions.map((name) => (
                <button type="button" role="option" key={name} onMouseDown={(event) => event.preventDefault()} onClick={() => selectCity(name)}>
                  <span><PinIcon /></span>
                  <strong>{name}</strong>
                  <small>Tunisie</small>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="beach-quick-head">
          <span>Accès rapide</span>
          <button type="button" onClick={() => { setCityQuery(''); setCity(''); setFocused(true) }}>Toutes les villes</button>
        </div>
        <div className="beach-city-chips" aria-label="Villes populaires">
          {QUICK_CITIES.map((name) => {
            const active = name === 'Toutes' ? !city && !cityQuery : normalize(city || cityQuery) === normalize(name)
            return (
              <button key={name} type="button" data-active={active ? 'true' : 'false'} onClick={() => selectCity(name)}>
                {name}
              </button>
            )
          })}
        </div>
      </section>

      <section className="beach-results" aria-live="polite">
        <header className="beach-results__head">
          <div>
            <span>{city || cityQuery ? `Séjours à ${city || cityQuery}` : 'Tous les séjours Plage'}</span>
            <h2>{visibleOffers.length ? `${visibleOffers.length} adresse${visibleOffers.length > 1 ? 's' : ''} sélectionnée${visibleOffers.length > 1 ? 's' : ''}` : 'Aucune adresse pour le moment'}</h2>
          </div>
          <span className="beach-results__count">{visibleOffers.length}</span>
        </header>

        <div className="beach-offer-list">
          {visibleOffers.map((item) => (
            <article className="beach-offer" key={item.id} onClick={() => onNavigate(`/listing/${item.id}`)}>
              <div className="beach-offer__media">
                <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                <span className="beach-offer__badge">{item.badge || 'Plage'}</span>
                <button type="button" className="beach-offer__heart" aria-label={`Ajouter ${item.title} aux favoris`} onClick={(event) => event.stopPropagation()}>
                  <HeartIcon />
                </button>
                <span className="beach-offer__rating">★ {item.rating || '4.90'}</span>
              </div>
              <div className="beach-offer__body">
                <div>
                  <span className="beach-offer__location"><PinIcon />{item.location}, Tunisie</span>
                  <h3>{item.title}</h3>
                </div>
                <div className="beach-offer__price">
                  <strong>{item.price} {item.currency}</strong>
                  <span>/ nuit</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!visibleOffers.length ? (
          <div className="beach-empty">
            <span>◌</span>
            <h3>Pas encore d’adresse Plage ici.</h3>
            <p>Essayez une autre ville ou affichez toute la collection.</p>
            <button type="button" onClick={() => selectCity('Toutes')}>Voir toutes les offres</button>
          </div>
        ) : null}
      </section>
    </div>
  )
}
