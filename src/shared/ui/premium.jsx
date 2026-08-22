import { MotionPressable } from '../motion/index.jsx'

function cx(...parts) { return parts.filter(Boolean).join(' ') }

export function Surface({ children, className = '', tone = 'default', padding = 'md', ...props }) {
  return <div className={cx('ui-surface', `ui-surface--${tone}`, `ui-surface--pad-${padding}`, className)} {...props}>{children}</div>
}

export function SectionHeader({ eyebrow, title, description, action, className = '' }) {
  return <header className={cx('ui-section-header', className)}>{eyebrow ? <p className="ui-section-header__eyebrow">{eyebrow}</p> : null}<div className="ui-section-header__row"><div><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>{action ? <div className="ui-section-header__action">{action}</div> : null}</div></header>
}

export function Stepper({ steps, activeIndex = 0, onStepChange, className = '' }) {
  return <div className={cx('ui-stepper', className)} role="list" aria-label="Étapes">{steps.map((step, index) => { const active = index === activeIndex; const complete = index < activeIndex; return <button key={step.id || step.label || index} type="button" className="ui-stepper__item" data-active={active || undefined} data-complete={complete || undefined} onClick={() => onStepChange?.(index)} disabled={step.disabled} role="listitem"><span className="ui-stepper__index">{complete ? '✓' : index + 1}</span><span className="ui-stepper__label">{step.label}</span></button> })}</div>
}

export function Counter({ label, hint, value, min = 0, max = Infinity, onChange, className = '' }) {
  const decrementDisabled = value <= min
  const incrementDisabled = value >= max
  return <div className={cx('ui-counter', className)}><div className="ui-counter__copy"><strong>{label}</strong>{hint ? <span>{hint}</span> : null}</div><div className="ui-counter__controls" aria-label={label}><MotionPressable type="button" className="ui-counter__button" aria-label={`Réduire ${label}`} disabled={decrementDisabled} onClick={() => onChange?.(Math.max(min, value - 1))}>−</MotionPressable><output className="ui-counter__value" aria-live="polite">{value}</output><MotionPressable type="button" className="ui-counter__button" aria-label={`Augmenter ${label}`} disabled={incrementDisabled} onClick={() => onChange?.(Math.min(max, value + 1))}>+</MotionPressable></div></div>
}

export function SearchField({ icon, className = '', ...props }) {
  return <label className={cx('ui-search-field', className)}>{icon ? <span className="ui-search-field__icon" aria-hidden="true">{icon}</span> : null}<input type="search" {...props} /></label>
}

export function StickyActionBar({ children, summary, className = '' }) {
  return <div className={cx('ui-sticky-action', className)}>{summary ? <div className="ui-sticky-action__summary">{summary}</div> : null}<div className="ui-sticky-action__main">{children}</div></div>
}

export function InlineMeta({ items = [], className = '' }) {
  return <div className={cx('ui-inline-meta', className)}>{items.filter(Boolean).map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div>
}
