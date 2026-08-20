import { useEffect, useId, useRef } from 'react'
import './ui.css'

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function Button({ children, loading = false, disabled = false, variant = 'primary', size = 'md', className = '', ...props }) {
  return (
    <button
      className={cx('ui-button', `ui-button--${variant}`, `ui-button--${size}`, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? 'Chargement…' : children}
    </button>
  )
}

export function IconButton({ label, children, variant = 'soft', size = 'md', className = '', ...props }) {
  return (
    <button
      className={cx('ui-icon-button', `ui-icon-button--${variant}`, `ui-icon-button--${size}`, className)}
      aria-label={label}
      {...props}
    >
      {children}
    </button>
  )
}

export function Surface({ children, elevation = 'none', tone = 'default', className = '', ...props }) {
  return <div className={cx('ui-surface', `ui-surface--${elevation}`, `ui-surface--${tone}`, className)} {...props}>{children}</div>
}

export function Card({ children, interactive = false, elevation = 'sm', className = '', ...props }) {
  return <div className={cx('ui-card', `ui-card--${elevation}`, interactive && 'ui-card--interactive', className)} {...props}>{children}</div>
}

export function Badge({ children, tone = 'neutral', className = '', ...props }) {
  return <span className={cx('ui-badge', `ui-badge--${tone}`, className)} {...props}>{children}</span>
}

export function PriceBadge({ children, className = '', ...props }) {
  return <span className={cx('ui-price-badge', className)} {...props}>{children}</span>
}

export function Avatar({ src, alt = '', size = 'md', className = '', ...props }) {
  if (src) return <img className={cx('ui-avatar', `ui-avatar--${size}`, className)} src={src} alt={alt} {...props} />
  return <div className={cx('ui-avatar', `ui-avatar--${size}`, className)} role="img" aria-label={alt || 'Avatar'} {...props} />
}

function Overlay({ children, onClose, align = 'center' }) {
  return (
    <div
      className={cx('ui-overlay', `ui-overlay--${align}`)}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      {children}
    </div>
  )
}

function useDialogFocus(open, onClose) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const node = ref.current
    const previous = document.activeElement
    const first = node?.querySelector('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')
    first?.focus?.()
    const keydown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', keydown)
    return () => {
      document.removeEventListener('keydown', keydown)
      previous?.focus?.()
    }
  }, [open, onClose])
  return ref
}

export function Modal({ open, onClose, children, label = 'Dialogue', className = '' }) {
  const ref = useDialogFocus(open, onClose)
  if (!open) return null
  return (
    <Overlay onClose={onClose}>
      <section ref={ref} className={cx('ui-modal', className)} role="dialog" aria-modal="true" aria-label={label}>{children}</section>
    </Overlay>
  )
}

export function Sheet({ open, onClose, children, label = 'Panneau', className = '' }) {
  const ref = useDialogFocus(open, onClose)
  if (!open) return null
  return (
    <Overlay onClose={onClose} align="end">
      <section ref={ref} className={cx('ui-sheet', className)} role="dialog" aria-modal="true" aria-label={label}>{children}</section>
    </Overlay>
  )
}

export const BottomSheet = Sheet

export function Drawer({ open, onClose, children, label = 'Menu', className = '' }) {
  const ref = useDialogFocus(open, onClose)
  if (!open) return null
  return (
    <Overlay onClose={onClose}>
      <aside ref={ref} className={cx('ui-drawer', className)} role="dialog" aria-modal="true" aria-label={label}>{children}</aside>
    </Overlay>
  )
}

export function Stepper({ steps = [], current = 0, className = '' }) {
  return (
    <ol className={cx('ui-stepper', className)} aria-label="Progression">
      {steps.map((step, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'upcoming'
        return (
          <li key={step.id || step.label || index} className={cx('ui-stepper__item', `ui-stepper__item--${state}`)} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="ui-stepper__dot" aria-hidden="true">{index + 1}</span>
            <span className="ui-stepper__label">{step.label ?? step}</span>
          </li>
        )
      })}
    </ol>
  )
}

export function Counter({ value = 0, min = 0, max = Infinity, onChange, label = 'Quantité', className = '' }) {
  const decDisabled = value <= min
  const incDisabled = value >= max
  return (
    <div className={cx('ui-counter', className)} role="group" aria-label={label}>
      <IconButton label={`Diminuer ${label}`} disabled={decDisabled} onClick={() => onChange?.(Math.max(min, value - 1))}>−</IconButton>
      <output className="ui-counter__value" aria-live="polite">{value}</output>
      <IconButton label={`Augmenter ${label}`} disabled={incDisabled} onClick={() => onChange?.(Math.min(max, value + 1))}>+</IconButton>
    </div>
  )
}

export function SearchField({ label = 'Recherche', icon, clearLabel = 'Effacer', value, onClear, className = '', inputClassName = '', ...props }) {
  const id = useId()
  const controlled = value !== undefined
  return (
    <label className={cx('ui-search-field', className)} htmlFor={id}>
      <span className="ui-visually-hidden">{label}</span>
      {icon ? <span className="ui-search-field__icon" aria-hidden="true">{icon}</span> : null}
      <input id={id} className={cx('ui-search-input', inputClassName)} type="search" value={value} {...props} />
      {controlled && value ? (
        <button type="button" className="ui-search-field__clear" aria-label={clearLabel} onClick={onClear}>×</button>
      ) : null}
    </label>
  )
}

export const SearchInput = SearchField

export function Calendar({ monthLabel, weekdays = [], days = [], onDaySelect, className = '' }) {
  return (
    <section className={cx('ui-calendar', className)} aria-label={monthLabel || 'Calendrier'}>
      {monthLabel ? <div className="ui-calendar__month">{monthLabel}</div> : null}
      <div className="ui-calendar__weekdays" aria-hidden="true">
        {weekdays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
      </div>
      <div className="ui-calendar__grid">
        {days.map((day, index) => {
          const isObject = typeof day === 'object' && day !== null
          const label = isObject ? day.label : day
          const value = isObject ? day.value ?? label : day
          const selected = Boolean(isObject && day.selected)
          const inRange = Boolean(isObject && day.inRange)
          const disabled = Boolean(isObject && day.disabled)
          const outside = Boolean(isObject && day.outside)
          return (
            <button
              type="button"
              key={isObject ? day.id || `${value}-${index}` : `${day}-${index}`}
              className={cx('ui-calendar__day', selected && 'is-selected', inRange && 'is-range', outside && 'is-outside')}
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => onDaySelect?.(day)}
            >
              {label}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function Toast({ children, role = 'status', className = '' }) {
  return <div className={cx('ui-toast', className)} role={role}>{children}</div>
}

export function Loader({ label = 'Chargement', className = '' }) {
  return <div className={cx('ui-loader', className)} role="status" aria-label={label} />
}

export function Skeleton({ width = '100%', height = 16, radius = 'var(--radius-sm)', className = '', ...props }) {
  return <div className={cx('ui-skeleton', className)} aria-hidden="true" style={{ width, height, borderRadius: radius }} {...props} />
}

export function EmptyState({ children = 'Aucun résultat.', className = '' }) {
  return <div className={cx('ui-state', className)} role="status">{children}</div>
}

export function ErrorState({ children = 'Une erreur est survenue.', className = '' }) {
  return <div className={cx('ui-state', 'ui-state--error', className)} role="alert">{children}</div>
}

export { AppNavLink, AppShell, PageFrame, PageStack, PageSection, SectionHeading, StickyActionBar } from './layout.jsx'
