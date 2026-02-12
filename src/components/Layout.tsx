import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: '#2196F3',
        color: 'white',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          height: '64px'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginRight: '48px' }}>
            Kalkman
          </h1>
          <nav style={{ display: 'flex', gap: '32px' }}>
            <Link
              to="/dashboard"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '16px',
                padding: '8px 0',
                borderBottom: isActive('/dashboard') ? '2px solid white' : '2px solid transparent',
                transition: 'border-color 0.3s'
              }}
            >
              仪表盘
            </Link>
            <Link
              to="/users"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '16px',
                padding: '8px 0',
                borderBottom: isActive('/users') || isActive('/profile') ? '2px solid white' : '2px solid transparent',
                transition: 'border-color 0.3s'
              }}
            >
              用户列表
            </Link>
            <Link
              to="/compare"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '16px',
                padding: '8px 0',
                borderBottom: isActive('/compare') ? '2px solid white' : '2px solid transparent',
                transition: 'border-color 0.3s'
              }}
            >
              用户对比
            </Link>
            <Link
              to="/videos"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '16px',
                padding: '8px 0',
                borderBottom: isActive('/videos') ? '2px solid white' : '2px solid transparent',
                transition: 'border-color 0.3s'
              }}
            >
              视频资源库
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: '#f5f5f5',
        padding: '16px 24px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        Kalkman - 用户画像分析系统 © 2024
      </footer>
    </div>
  )
}
