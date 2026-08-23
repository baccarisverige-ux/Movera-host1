import '../../styles/guest-bottom-nav.css'
import { getGuestNavigationPath, isGuestCollectionRoute } from '../../shared/navigation/guestCollectionRoutes.js'

const guestNav = [
  { label: 'Accueil', path: '/', icon: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></> },
  { label: 'Carte', path: '/map', icon: <><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/></> },
  { label: 'Favoris', path: '/favorites', disabled: true, icon: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></> },
  { label: 'Messages', path: '/messages', disabled: true, icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></> },
  { label: 'Profil', path: '/profile', disabled: true, icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
]

const mapShellStyle = { maxWidth: 430, margin: '0 auto', background: '#eff1ef' }
const mapContentStyle = { padding: 0, overflow: 'hidden' }
const mapNavStyle = { position: 'fixed', left: '50%', right: 'auto', bottom: 0, width: 'min(100%, 430px)', transform: 'translateX(-50%)', zIndex: 50 }
const collectionContentStyle = { padding: 0, overflow: 'auto', background: '#f7f7f5' }

function AppLink({ children, className, href, onNavigate, active, disabled = false }) {
  return (
    <a
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      className={className}
      data-active={active ? 'true' : 'false'}
      href={href}
      onClick={(event) => {
        event.preventDefault()
        if (disabled) return
        onNavigate(href)
      }}
    >
      {children}
    </a>
  )
}

export function GuestLayout({ children, currentPath, onNavigate }) {
  const activePath = getGuestNavigationPath(currentPath)
  const isMapRoute = currentPath === '/map'
  const isCollectionRoute = isGuestCollectionRoute(currentPath)
  const isBeachRoute = currentPath === '/plage'

  return (
    <div className={`app-shell app-shell--guest${isMapRoute ? ' app-shell--map' : ''}${isCollectionRoute ? ' app-shell--collection' : ''}${isBeachRoute ? ' app-shell--beach' : ''}`} style={isMapRoute ? mapShellStyle : undefined}>
      <header className="app-shell__header" style={isMapRoute ? { display: 'none' } : undefined}>
        <strong>Movera Host</strong>
      </header>
      <main
        className="app-shell__content"
        id="main-content"
        tabIndex={-1}
        style={isMapRoute ? mapContentStyle : isCollectionRoute ? collectionContentStyle : undefined}
      >
        {children}
      </main>
      <nav className="app-shell__nav" aria-label="Navigation principale" style={isMapRoute ? mapNavStyle : undefined}>
        {guestNav.map(({ label, path, icon, disabled }) => (
          <AppLink
            active={activePath === path}
            className="app-shell__nav-item"
            href={path}
            key={path}
            onNavigate={onNavigate}
            disabled={disabled}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>
            <span>{label}</span>
          </AppLink>
        ))}
      </nav>
    </div>
  )
}
