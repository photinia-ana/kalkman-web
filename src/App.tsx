import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import UserProfile from './pages/UserProfile'
import UserList from './pages/UserList'
import Compare from './pages/Compare'
import VideoLibrary from './pages/VideoLibrary'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="profile/:userId" element={<UserProfile />} />
          <Route path="compare" element={<Compare />} />
          <Route path="videos" element={<VideoLibrary />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
