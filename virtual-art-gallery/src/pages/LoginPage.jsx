import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Alert } from '@/components/ui'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signIn(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex">
      {/* Left panel - art */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'linear-gradient(135deg, #0a0a0f 0%, #2e1d14 40%, #0a0a0f 100%)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="text-center">
            <div className="w-32 h-32 border border-gallery-700/50 mx-auto mb-8 flex items-center justify-center animate-float">
              <div className="w-12 h-12 bg-gallery-600/30 border border-gallery-500/50" />
            </div>
            <blockquote className="font-display text-3xl text-gallery-300 italic leading-snug max-w-sm">
              "Art enables us to find ourselves and lose ourselves at the same time."
            </blockquote>
            <cite className="block mt-4 text-gallery-600 font-body text-sm not-italic">— Thomas Merton</cite>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-obsidian/80 to-transparent" />
      </div>

      {/* Right panel - form */}
      <div className="flex-1 lg:max-w-md flex flex-col items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <Link to="/" className="flex items-center gap-2 text-gallery-500 hover:text-gallery-300 transition-colors mb-8 text-sm font-body tracking-wide">
              ← Back to home
            </Link>
            <h1 className="font-display text-4xl text-ivory mb-2">Welcome Back</h1>
            <p className="text-gallery-500 font-body text-sm">Sign in to your gallery account.</p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert type="error" message={error} onClose={() => setError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="artist@gallery.com"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-gallery-600 text-sm font-body">
            Don't have an account?{' '}
            <Link to="/register" className="text-gallery-400 hover:text-ivory transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
