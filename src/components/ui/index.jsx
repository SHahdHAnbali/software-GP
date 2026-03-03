import { forwardRef } from 'react'

// Spinner
export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={`loader ${sizes[size]} ${className}`} />
  )
}

// Full-page loader
export function PageLoader({ text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-obsidian flex flex-col items-center justify-center z-50">
      <Spinner size="lg" />
      <p className="mt-4 text-gallery-400 font-body text-sm tracking-widest uppercase">{text}</p>
    </div>
  )
}

// Button
export const Button = forwardRef(function Button(
  { children, variant = 'primary', loading = false, className = '', ...props },
  ref
) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  }
  return (
    <button
      ref={ref}
      className={`${variants[variant]} flex items-center justify-center gap-2 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
})

// Input
export const Input = forwardRef(function Input(
  { label, error, className = '', ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <input ref={ref} className={`input-field ${error ? 'border-red-700' : ''} ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
})

// Textarea
export const Textarea = forwardRef(function Textarea(
  { label, error, className = '', rows = 4, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <textarea
        ref={ref}
        rows={rows}
        className={`input-field resize-none ${error ? 'border-red-700' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
})

// Select
export const Select = forwardRef(function Select(
  { label, error, children, className = '', ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <select
        ref={ref}
        className={`input-field ${error ? 'border-red-700' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
})

// Modal
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  }

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-obsidian/90 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative ${sizes[size]} w-full glass-panel rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gallery-800/30">
          <h2 className="font-display text-xl text-ivory">{title}</h2>
          <button
            onClick={onClose}
            className="text-gallery-500 hover:text-ivory transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// Toast / Alert
export function Alert({ type = 'info', message, onClose }) {
  const styles = {
    info: 'bg-blue-950/50 border-blue-800 text-blue-200',
    success: 'bg-green-950/50 border-green-800 text-green-200',
    error: 'bg-red-950/50 border-red-800 text-red-200',
    warning: 'bg-amber-950/50 border-amber-800 text-amber-200',
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-sm border text-sm ${styles[type]} animate-slide-up`}>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-70 hover:opacity-100">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

// Badge
export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-gallery-800/50 text-gallery-300',
    artist: 'bg-gallery-700/50 text-gallery-200',
    visitor: 'bg-blue-900/50 text-blue-300',
    new: 'bg-green-900/50 text-green-300',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider rounded-full ${variants[variant]}`}>
      {children}
    </span>
  )
}

// Divider
export function Divider({ label }) {
  return (
    <div className="relative flex items-center my-6">
      <div className="flex-1 border-t border-gallery-800/50" />
      {label && (
        <span className="mx-4 text-xs text-gallery-600 uppercase tracking-widest font-mono">{label}</span>
      )}
      <div className="flex-1 border-t border-gallery-800/50" />
    </div>
  )
}

// Empty state
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {icon && <div className="text-gallery-700 mb-4">{icon}</div>}
      <h3 className="font-display text-xl text-gallery-300 mb-2">{title}</h3>
      {description && <p className="text-gallery-500 text-sm max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  )
}

// Price formatter
export function PriceTag({ price }) {
  if (!price) return <span className="text-gallery-600 text-sm">Price on request</span>
  return (
    <span className="font-mono text-gallery-300 text-sm">
      ${Number(price).toLocaleString()}
    </span>
  )
}
