const guestNav = [
  ['Accueil', '/'],
  ['Carte', '/map'],
  ['Favoris', '/favorites'],
  ['Messages', '/messages'],
  ['Profil', '/profile'],
]

function AppLink({ children, className, href, onNavigate, active }) {
  return (
    <a
      aria-current={active ? 'page' : undefined}
      className={className}
      data-active={active ? 'true' : 'false'}
      href={href}
      onClick={(event) => {
        event.preventDefault()
        onNavigate(href)
      }}
    >
      {children}
    </a>
  )
}

export function GuestLayout({ children, currentPath, onNavigate }) {
  return (
    <div className="app-shell app-shell--guest">
      <header className="app-shell__header">
        <strong>Movera Host</strong>
        <AppLink className="shell-switch" href="/host" onNavigate={onNavigate}>Mode hôte</AppLink>
      </header>
      <main className="app-shell__content" id="main-content" tabIndex={-1}>{children}</main>
      <nav className="app-shell__nav" aria-label="Navigation principale">
        {guestNav.map(([label, path]) => (
          <AppLink
            active={currentPath === path}
            className="app-shell__nav-item"
            href={path}
            key={path}
            onNavigate={onNavigate}
          >
            {label}
          </AppLink>
        ))}
      </nav>
    </div>
  )
}
