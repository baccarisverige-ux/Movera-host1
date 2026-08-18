const guestNav = [
  ['Accueil', '/'],
  ['Carte', '/map'],
  ['Favoris', '/favorites'],
  ['Messages', '/messages'],
  ['Profil', '/profile'],
]

export function GuestLayout({ children, currentPath, onNavigate }) {
  return (
    <div className="app-shell app-shell--guest">
      <header className="app-shell__header">
        <strong>Movera Host</strong>
        <button className="shell-switch" type="button" onClick={() => onNavigate('/host')}>Mode hôte</button>
      </header>
      <main className="app-shell__content">{children}</main>
      <nav className="app-shell__nav" aria-label="Navigation principale">
        {guestNav.map(([label, path]) => (
          <button
            className="app-shell__nav-item"
            data-active={currentPath === path ? 'true' : 'false'}
            key={path}
            type="button"
            onClick={() => onNavigate(path)}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
