import './layout.css'

function cx(...parts){return parts.filter(Boolean).join(' ')}

export function AppNavLink({children,className='',href,onNavigate,active=false,...props}){
 return <a aria-current={active?'page':undefined} className={className} data-active={active?'true':'false'} href={href} onClick={event=>{event.preventDefault();onNavigate?.(href)}} {...props}>{children}</a>
}

export function AppShell({children,mode='guest',brand='Movera Host',switchLabel,switchHref,onNavigate,headerAfter,navigation,navLabel='Navigation principale',currentPath}){
 const host=mode==='host'
 return <div className={`app-shell app-shell--${mode}`} data-ui-system="movera">
  <header className="app-shell__header"><strong>{brand}</strong>{headerAfter}{switchLabel&&switchHref?<AppNavLink className="shell-switch" href={switchHref} onNavigate={onNavigate}>{switchLabel}</AppNavLink>:null}</header>
  {host&&navigation?<nav className="host-shell__rail" aria-label={navLabel}>{navigation.map(([label,path])=><AppNavLink active={currentPath===path} className="host-shell__rail-item" href={path} key={path} onNavigate={onNavigate}>{label}</AppNavLink>)}</nav>:null}
  <main className="app-shell__content" id="main-content" tabIndex={-1}>{children}</main>
  {!host&&navigation?<nav className="app-shell__nav" aria-label={navLabel}>{navigation.map(([label,path])=><AppNavLink active={currentPath===path} className="app-shell__nav-item" href={path} key={path} onNavigate={onNavigate}>{label}</AppNavLink>)}</nav>:null}
 </div>
}

export function PageFrame({children,size='default',className='',...props}){
 return <div className={cx('ui-page-frame',`ui-page-frame--${size}`,className)} {...props}>{children}</div>
}

export function PageStack({children,gap='md',className='',...props}){
 return <div className={cx('ui-page-stack',`ui-page-stack--${gap}`,className)} {...props}>{children}</div>
}

export function PageSection({children,className='',...props}){
 return <section className={cx('ui-page-section',className)} {...props}>{children}</section>
}

export function SectionHeading({title,eyebrow,description,action,className='',...props}){
 return <header className={cx('ui-section-heading',className)} {...props}><div>{eyebrow?<p className="ui-section-heading__eyebrow">{eyebrow}</p>:null}<h2>{title}</h2>{description?<p className="ui-section-heading__description">{description}</p>:null}</div>{action?<div className="ui-section-heading__action">{action}</div>:null}</header>
}

export function StickyActionBar({children,className='',...props}){
 return <div className={cx('ui-sticky-action-bar',className)} {...props}>{children}</div>
}
