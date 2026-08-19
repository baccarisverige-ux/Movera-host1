const guestNav = [
  ['Accueil', '/'],
  ['Carte', '/map'],
  ['Favoris', '/favorites'],
  ['Messages', '/messages'],
  ['Profil', '/profile'],
]

const mapShellStyle = { maxWidth: 430, margin: '0 auto', background: '#eef0ee' }
const mapContentStyle = { padding: 0, overflow: 'hidden' }
const mapNavStyle = { position: 'fixed', left: '50%', right: 'auto', bottom: 0, width: 'min(100%, 430px)', transform: 'translateX(-50%)', zIndex: 50 }

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
  const isMapRoute = currentPath === '/map'

  return (
    <div className={`app-shell app-shell--guest${isMapRoute ? ' app-shell--map' : ''}`} style={isMapRoute ? mapShellStyle : undefined}>
      <header className="app-shell__header" style={isMapRoute ? { display: 'none' } : undefined}>
        <strong>Movera Host</strong>
        <AppLink className="shell-switch" href="/host" onNavigate={onNavigate}>Mode hôte</AppLink>
      </header>
      <main className="app-shell__content" id="main-content" tabIndex={-1} style={isMapRoute ? mapContentStyle : undefined}>{children}</main>
      <nav className="app-shell__nav" aria-label="Navigation principale" style={isMapRoute ? mapNavStyle : undefined}>
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
