import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { GalleryProvider } from '@/contexts/GalleryContext'
import { ProtectedRoute, PublicOnlyRoute } from '@/components/layout/ProtectedRoute'
import Navbar from '@/components/layout/Navbar'

import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ProfilePage from '@/pages/ProfilePage'
import GalleryPage from '@/pages/GalleryPage'
import ExplorePage from '@/pages/ExplorePage'
import DashboardPage from '@/pages/DashboardPage'

function Layout({ children, hideNav }) {
  return (
    <div className="min-h-screen bg-obsidian">
      {!hideNav && <Navbar />}
      {children}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GalleryProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/explore" element={<Layout><ExplorePage /></Layout>} />

            {/* Auth routes (redirect if logged in) */}
            <Route path="/login" element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            } />
            <Route path="/register" element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            } />

            {/* Protected routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout><ProfilePage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="artist">
                <Layout><DashboardPage /></Layout>
              </ProtectedRoute>
            } />

            {/* 3D Gallery (full screen - no nav) */}
            <Route path="/gallery" element={<GalleryPage />} />
          </Routes>
        </GalleryProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
