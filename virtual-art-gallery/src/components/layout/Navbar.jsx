import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setMenuOpen(false)
  }

  const navLinks = [
    { href: '/gallery', label: 'Gallery' },
    ...(profile?.user_type === 'artist' ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
    { href: '/explore', label: 'Explore' },
  ]

  const isActive = (href) => location.pathname === href

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-gallery-800/30">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-gallery-500 flex items-center justify-center group-hover:border-gallery-300 transition-colors">
            <div className="w-3 h-3 bg-gallery-500 group-hover:bg-gallery-300 transition-colors" />
          </div>
          <span className="font-display text-lg text-ivory tracking-wide">
            Virtual <span className="text-gallery-400">Gallery</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-body tracking-widest uppercase transition-colors ${
                isActive(link.href)
                  ? 'text-gallery-300'
                  : 'text-gallery-500 hover:text-ivory'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 group">
                {profile?.profile_pic ? (
                  <img
                    src={profile.profile_pic}
                    alt={profile.username}
                    className="w-8 h-8 rounded-full object-cover border border-gallery-700 group-hover:border-gallery-400 transition-colors"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gallery-800 border border-gallery-700 group-hover:border-gallery-400 transition-colors flex items-center justify-center">
                    <span className="text-xs font-mono text-gallery-400">
                      {profile?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gallery-400 group-hover:text-ivory transition-colors font-body">
                  {profile?.username || 'Profile'}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-gallery-600 hover:text-gallery-300 transition-colors font-body tracking-wide"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gallery-400 hover:text-ivory transition-colors font-body tracking-wide">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-xs py-2 px-4">
                Join
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gallery-400 hover:text-ivory transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-panel border-t border-gallery-800/30 px-6 py-4 space-y-4 animate-fade-in">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block text-sm font-body tracking-widest uppercase py-2 transition-colors ${
                isActive(link.href) ? 'text-gallery-300' : 'text-gallery-500'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gallery-800/30 pt-4">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block text-sm text-gallery-400 py-2">Profile</Link>
                <button onClick={handleSignOut} className="block text-sm text-gallery-600 py-2">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm text-gallery-400 py-2">Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-sm text-gallery-300 py-2">Join Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
