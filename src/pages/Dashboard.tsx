import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { profileApi } from '../api'
import { UserProfile } from '../types'
import Card from '../components/Card'

export default function Dashboard() {
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({})
  const [loading, setLoading] = useState(true)

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

  const userCount = Object.keys(profiles).length
  const totalRatings = Object.values(profiles).reduce((sum, p) => sum + p.totalRatings, 0)
  const avgScore = userCount > 0
    ? (Object.values(profiles).reduce((sum, p) => sum + p.averageScore, 0) / userCount).toFixed(1)
    : '0'

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '48px' }}>加载中...</div>
  }

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
        数据概览
      </h2>

      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <Card>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            总用户数
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2196F3' }}>
            {userCount}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            总评分数
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4CAF50' }}>
            {totalRatings}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            平均评分
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FF9800' }}>
            {avgScore}
          </div>
        </Card>
      </div>

      {/* 用户列表预览 */}
      <Card title="最近活跃用户">
        {userCount === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
            暂无用户数据
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.values(profiles).slice(0, 5).map((profile) => (
              <Link
                key={profile.userId}
                to={`/profile/${profile.userId}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#f9f9f9',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f9f9f9'}
              >
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    用户 {profile.userId.slice(0, 8)}...
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {profile.totalRatings} 条评分 · 平均 {profile.averageScore} 分
                  </div>
                </div>
                <div style={{
                  padding: '4px 12px',
                  background: profile.sentiment.overallSentiment === 'positive' ? '#e8f5e9' :
                    profile.sentiment.overallSentiment === 'negative' ? '#ffebee' : '#f5f5f5',
                  color: profile.sentiment.overallSentiment === 'positive' ? '#4CAF50' :
                    profile.sentiment.overallSentiment === 'negative' ? '#f44336' : '#666',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {profile.sentiment.overallSentiment === 'positive' ? '积极' :
                    profile.sentiment.overallSentiment === 'negative' ? '消极' : '中性'}
                </div>
              </Link>
            ))}
            <Link
              to="/users"
              style={{
                textAlign: 'center',
                padding: '12px',
                color: '#2196F3',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              查看全部用户 →
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}
