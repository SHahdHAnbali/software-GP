import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Select, Alert } from '@/components/ui'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    userType: 'visitor',
    galleryName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.')
    }
    if (form.password.length < 8) {
      return setError('Password must be at least 8 characters.')
    }
    if (!form.username.trim()) {
      return setError('Username is required.')
    }

    setLoading(true)
    try {
      await signUp({
        email: form.email,
        password: form.password,
        username: form.username.trim(),
        userType: form.userType,
        galleryName: form.galleryName.trim() || null,
      })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        <div className="mb-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-gallery-500 hover:text-gallery-300 transition-colors mb-8 text-sm font-body tracking-wide">
            ← Back to home
          </Link>
          <h1 className="font-display text-4xl text-ivory mb-2">Join the Gallery</h1>
          <p className="text-gallery-500 font-body text-sm">Create your account to explore or exhibit.</p>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selection */}
            <div>
              <label className="label">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {['visitor', 'artist'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, userType: type }))}
                    className={`py-3 px-4 rounded-sm border text-sm font-body uppercase tracking-widest transition-all ${
                      form.userType === type
                        ? 'border-gallery-400 text-gallery-300 bg-gallery-900/30'
                        : 'border-gallery-800 text-gallery-600 hover:border-gallery-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="your_name"
                required
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            {form.userType === 'artist' && (
              <Input
                label="Gallery Name (optional)"
                type="text"
                name="galleryName"
                value={form.galleryName}
                onChange={handleChange}
                placeholder="My Personal Gallery"
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2">
              Create Account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-gallery-600 text-sm font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-gallery-400 hover:text-ivory transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
