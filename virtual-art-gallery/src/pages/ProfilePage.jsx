import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Textarea, Alert, Badge, Spinner } from '@/components/ui'

export default function ProfilePage() {
  const { user, profile, updateProfile, uploadAvatar } = useAuth()
  const fileRef = useRef()

  const [form, setForm] = useState({
    username: profile?.username || '',
    gallery_name: profile?.gallery_name || '',
    bio: profile?.bio || '',
  })
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSave = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await updateProfile(form)
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(err.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) return setError('Avatar must be under 2MB.')

    setAvatarLoading(true)
    setError('')
    try {
      await uploadAvatar(file)
      setSuccess('Avatar updated!')
    } catch (err) {
      setError(err.message || 'Failed to upload avatar.')
    } finally {
      setAvatarLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian pt-20">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-gallery-600 text-xs tracking-widest uppercase font-mono mb-2">Account</p>
          <h1 className="font-display text-4xl text-ivory">Your Profile</h1>
        </div>

        {success && (
          <div className="mb-6">
            <Alert type="success" message={success} onClose={() => setSuccess('')} />
          </div>
        )}
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        <div className="card p-8 mb-6">
          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gallery-800/30">
            <div className="relative">
              {profile?.profile_pic ? (
                <img
                  src={profile.profile_pic}
                  alt={profile.username}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gallery-700"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gallery-800 border-2 border-gallery-700 flex items-center justify-center">
                  <span className="font-display text-2xl text-gallery-500">
                    {profile?.username?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              {avatarLoading && (
                <div className="absolute inset-0 rounded-full bg-obsidian/80 flex items-center justify-center">
                  <Spinner size="sm" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-display text-xl text-ivory">{profile?.username}</h2>
                <Badge variant={profile?.user_type}>{profile?.user_type}</Badge>
              </div>
              <p className="text-gallery-500 text-sm font-body mb-3">{user?.email}</p>
              <button
                onClick={() => fileRef.current?.click()}
                className="text-xs text-gallery-400 hover:text-gallery-200 transition-colors font-body uppercase tracking-wider"
              >
                Change Photo
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
              {profile?.user_type === 'artist' && (
                <Input
                  label="Gallery Name"
                  name="gallery_name"
                  value={form.gallery_name}
                  onChange={handleChange}
                  placeholder="My Gallery"
                />
              )}
            </div>

            <Textarea
              label="Bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell visitors about yourself and your art..."
              rows={4}
            />

            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </form>
        </div>

        {/* Account info */}
        <div className="card p-6">
          <h3 className="font-display text-lg text-gallery-300 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gallery-500 text-sm font-body">Email</span>
              <span className="text-gallery-300 text-sm font-mono">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gallery-500 text-sm font-body">Account Type</span>
              <Badge variant={profile?.user_type}>{profile?.user_type}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gallery-500 text-sm font-body">Member Since</span>
              <span className="text-gallery-300 text-sm font-mono">
                {new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
