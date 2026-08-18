const hostNav = [
  ['Dashboard', '/host'],
  ['Annonces', '/host/listings'],
  ['Réservations', '/host/reservations'],
  ['Calendrier', '/host/calendar'],
  ['Revenus', '/host/earnings'],
  ['Paramètres', '/host/settings'],
]

export function HostLayout({ children, currentPath, onNavigate }) {
  return (
    <div className="app-shell app-shell--host">
      <header className="app-shell__header">
        <strong>Movera Host · Hôte</strong>
        <button className="shell-switch" type="button" onClick={() => onNavigate('/')}>Mode voyageur</button>
      </header>
      <nav className="host-shell__rail" aria-label="Navigation hôte">
        {hostNav.map(([label, path]) => (
          <button
            className="host-shell__rail-item"
            data-active={currentPath === path ? 'true' : 'false'}
            key={path}
            type="button"
            onClick={() => onNavigate(path)}
          >
            {label}
          </button>
        ))}
      </nav>
      <main className="app-shell__content">{children}</main>
    </div>
  )
}
