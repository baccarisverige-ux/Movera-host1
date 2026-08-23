import { useMemo, useState } from 'react'
import { homeCategories, homeFeatured } from './data/homeData.js'
import { getCollectionRouteForCategory } from '../../shared/navigation/guestCollectionRoutes.js'
import '../../styles/home-b225.css'
import '../../styles/home-b225-block2.css'
import '../../styles/home-b225-block3.css'
import '../../styles/home-map-search-copy.css'
import '../../styles/home-section-alignment.css'
import '../../styles/home-premium-polish.css'
import '../../styles/home-mirror-header.css'
import '../../styles/home-reference-gloss.css'
import '../../styles/home-category-3d-strong.css'
import '../../styles/home-airbnb-surface.css'
import '../../styles/home-category-6d.css'
import ALL_CATEGORY_GLOBE from './assets/all-category-globe.png'
import BEACH_CATEGORY_ICON from './assets/plage-category.png'
import HOTEL_CATEGORY_ICON from './assets/hotel-category.png'
import APPARTEMENT_CATEGORY_ICON from './assets/appartement-category.png'
import GUESTHOUSE_CATEGORY_ICON from './assets/maison-hote-category.png'
import VILLA_CATEGORY_ICON from './assets/villa-category.png'
import EXPERIENCE_CATEGORY_ICON from './assets/experience-category.webp'
import PARTNER_CATEGORY_ICON from './assets/partner-category.png'
import { getSelectedHomeCategory, setSelectedHomeCategory } from './homeCategorySelection.js'

const CATEGORY_ARTWORK = {
 all: ALL_CATEGORY_GLOBE,
 guesthouse: GUESTHOUSE_CATEGORY_ICON,
 beach: BEACH_CATEGORY_ICON,
 hotel: HOTEL_CATEGORY_ICON,
 family: APPARTEMENT_CATEGORY_ICON,
 prestige: VILLA_CATEGORY_ICON,
 experience: EXPERIENCE_CATEGORY_ICON,
 partner: PARTNER_CATEGORY_ICON,
}

const WELCOME_CITIES = [
  { id: 'sidi-bou-said', label: 'Sidi Bou Saïd' },
  { id: 'sousse', label: 'Sousse' },
  { id: 'hammamet', label: 'Hammamet' },
  { id: 'tunis', label: 'Tunis' },
  { id: 'djerba', label: 'Djerba' },
  { id: 'tozeur', label: 'Tozeur' },
  { id: 'tabarka', label: 'Tabarka' },
]

function SearchIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>}
function CategoryArtwork({id}){const src=CATEGORY_ARTWORK[id];return src?<img className="b225-category-icon" data-category-icon={id} src={src} alt="" aria-hidden="true" decoding="async"/>:null}
function ListingCard({item}){return <article className="b225-card b225-featured-card" data-testid={`home-card-${item.id}`}><div className="b225-card__image"><img src={item.image} alt={item.title} loading="lazy" decoding="async"/>{item.badge?<span className="b225-card__badge">{item.badge}</span>:null}<button type="button" className="b225-card__heart" aria-label={`Ajouter ${item.title} aux favoris`}>♡</button></div><div className="b225-card__body"><p className="b225-featured-line"><strong>{item.title}</strong><span> — {item.price} {item.currency}</span></p></div></article>}
function CategorySelection({id,title,items}){return <section className="b225-section b225-featured-section b225-category-selection" data-category-selection={id} data-testid={`home-selection-${id}`}><div className="b225-section__title"><h2>{title}</h2></div>{items.length?<div className="b225-scroll b225-featured-scroll">{items.map(item=><ListingCard key={`${id}-${item.id}`} item={item}/>)}</div>:<p className="b225-empty">Sélection à venir.</p>}</section>}

export function HomePage({onNavigate}){
 const [category,setCategory]=useState(getSelectedHomeCategory); const [query,setQuery]=useState('');
 const selectCategory=(item)=>{setCategory(item.id);setSelectedHomeCategory(item.id);const route=getCollectionRouteForCategory(item.id);if(route)onNavigate(route)};
 const categorySelections=useMemo(()=>{
  const q=query.trim().toLowerCase()
  return homeCategories.map(item=>({
   id:item.id,
   title:item.label,
   items:homeFeatured.filter(listing=>
    (item.id==='all'||listing.category.split(' ').includes(item.id))&&
    (!q||`${listing.title} ${listing.location}`.toLowerCase().includes(q))
   ),
  }))
 },[query])
 return <div className="b225-home" data-testid="page-home">
 <header className="b225-home-header"><div className="b225-brand">Movera Host</div><label className="b225-search b225-home-map-search" aria-label="Rechercher une destination"><SearchIcon/><span className="b225-home-map-search__copy"><strong>Explorez autrement</strong><span>Destination · Dates · Voyageurs</span></span><input data-testid="home-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} aria-label="Destination" readOnly tabIndex={-1}/><span className="b225-home-map-filter-button" aria-hidden="true">≡</span></label></header>
 <div className="b225-categories" data-testid="home-categories">{homeCategories.map(item=><button key={item.id} type="button" data-category-id={item.id} data-active={category===item.id?'true':'false'} aria-pressed={category===item.id} onClick={()=>selectCategory(item)}><CategoryArtwork id={item.id}/>{item.label}</button>)}</div>
 <section className="b225-welcome" aria-label="Bienvenue chez Movera"><span className="b225-welcome__title">Bienvenue chez Movera</span><div className="b225-welcome-cities" data-testid="home-welcome-cities">{WELCOME_CITIES.map(city=><button key={city.id} type="button" className="b225-welcome-city" data-city-id={city.id} onClick={()=>onNavigate(`/map?destination=${city.id}`)} aria-label={`Explorer ${city.label} sur la carte`}>{city.label}</button>)}</div></section>
 {categorySelections.map(selection=><CategorySelection key={selection.id} id={selection.id} title={selection.title} items={selection.items}/>)}
 </div>
}
