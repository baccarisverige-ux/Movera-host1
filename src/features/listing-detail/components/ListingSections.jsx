export function ListingHeader({ listing, favorite, onToggleFavorite }) {
  return <header className="listing-detail__header" data-testid="listing-header"><p className="route-page__eyebrow">Guest · Detail</p><h1>{listing.title}</h1><p>{listing.subtitle}</p><span>★ {listing.rating} · {listing.reviews} avis</span><button type="button" data-testid="favorite-toggle" aria-pressed={favorite} onClick={onToggleFavorite}>{favorite?'Retirer des favoris':'Ajouter aux favoris'}</button></header>
}

export function ListingSections({ listing }) {
  return <><section className="listing-detail__section" data-testid="listing-location"><h2>Localisation</h2><p>{listing.location}</p></section><section className="listing-detail__section" data-testid="listing-amenities"><h2>Équipements</h2><ul>{listing.amenities.map(item=><li key={item}>{item}</li>)}</ul></section><section className="listing-detail__section listing-host" data-testid="listing-host-card"><div className="listing-host__avatar" aria-hidden="true">{listing.host.name.slice(0,1)}</div><div><h2>{listing.host.name}</h2><p>{listing.host.since} · {listing.host.response}</p></div></section><section className="listing-detail__section" data-testid="listing-availability"><h2>Disponibilité</h2><p>{listing.availability}</p></section></>
}

export function ListingPricing({ pricing, onBook }) {
  return <section className="listing-pricing" data-testid="listing-pricing-summary"><div><strong>{pricing.nightlyLabel}</strong><span>{pricing.feesLabel}</span></div><button type="button" data-testid="booking-cta" onClick={onBook}>{pricing.bookingLabel}</button></section>
}
