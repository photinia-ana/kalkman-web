import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { profileApi } from '../api'
import { UserProfile } from '../types'
import Card from '../components/Card'

export default function UserList() {
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    try {
      const data = await profileApi.getAllProfiles()
      setProfiles(data)
    } catch (error) {
      console.error('加载失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProfiles = Object.values(profiles).filter(profile =>
    profile.userId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '48px' }}>加载中...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>
          用户列表
        </h2>
        <input
          type="text"
          placeholder="搜索用户 ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            width: '300px'
          }}
        />
      </div>

      <Card>
        {filteredProfiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#999' }}>
            {searchTerm ? '未找到匹配的用户' : '暂无用户数据'}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredProfiles.map((profile) => (
              <Link
                key={profile.userId}
                to={`/profile/${profile.userId}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '24px',
                  padding: '20px',
                  background: '#f9f9f9',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f9f9f9'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                    用户 {profile.userId}
                  </div>
                  <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#666' }}>
                    <span>📊 {profile.totalRatings} 条评分</span>
                    <span>⭐ 平均 {profile.averageScore} 分</span>
                    <span>
                      {profile.sentiment.overallSentiment === 'positive' ? '😊 积极' :
                        profile.sentiment.overallSentiment === 'negative' ? '😞 消极' : '😐 中性'}
                    </span>
                  </div>
                  {profile.interests.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {profile.interests.slice(0, 5).map((interest) => (
                        <span
                          key={interest.tag}
                          style={{
                            padding: '4px 12px',
                            background: '#e3f2fd',
                            color: '#2196F3',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}
                        >
                          {interest.tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#2196F3',
                  fontSize: '24px'
                }}>
                  →
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
