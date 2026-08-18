const hostNav = [
  ['Dashboard', '/host'],
  ['Annonces', '/host/listings'],
  ['Réservations', '/host/reservations'],
  ['Calendrier', '/host/calendar'],
  ['Revenus', '/host/earnings'],
  ['Paramètres', '/host/settings'],
]

function AppLink({ children, className, href, onNavigate, active }) {
  return (
    <a
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

export function HostLayout({ children, currentPath, onNavigate }) {
  return (
    <div className="app-shell app-shell--host">
      <header className="app-shell__header">
        <strong>Movera Host · Hôte</strong>
        <AppLink className="shell-switch" href="/" onNavigate={onNavigate}>Mode voyageur</AppLink>
      </header>
      <nav className="host-shell__rail" aria-label="Navigation hôte">
        {hostNav.map(([label, path]) => (
          <AppLink
            active={currentPath === path}
            className="host-shell__rail-item"
            href={path}
            key={path}
            onNavigate={onNavigate}
          >
            {label}
          </AppLink>
        ))}
      </nav>
      <main className="app-shell__content">{children}</main>
    </div>
  )
}
