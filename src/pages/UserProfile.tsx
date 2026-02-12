import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { profileApi } from '../api'
import { UserProfile as UserProfileType } from '../types'
import Card from '../components/Card'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#00BCD4']

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>()
  const [profile, setProfile] = useState<UserProfileType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      loadProfile(userId)
    }
  }, [userId])

  const loadProfile = async (id: string) => {
    try {
      const data = await profileApi.getUserProfile(id)
      setProfile(data)
    } catch (error) {
      console.error('加载失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '48px' }}>加载中...</div>
  }

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: '48px' }}>
        <div style={{ fontSize: '18px', color: '#999', marginBottom: '16px' }}>
          未找到用户数据
        </div>
        <Link to="/users" style={{ color: '#2196F3', textDecoration: 'none' }}>
          返回用户列表
        </Link>
      </div>
    )
  }

  // 准备图表数据
  const categoryData = profile.categories.slice(0, 6).map(c => ({
    name: c.category,
    count: c.count,
    score: c.averageScore
  }))

  const sentimentData = [
    { name: '积极', value: profile.sentiment.positive * 100 },
    { name: '中性', value: profile.sentiment.neutral * 100 },
    { name: '消极', value: profile.sentiment.negative * 100 }
  ]

  const hourlyData = Object.entries(profile.timePatterns.hourlyDistribution)
    .map(([hour, count]) => ({
      hour: `${hour}:00`,
      count
    }))

  return (
    <div>
      {/* 返回按钮 */}
      <Link
        to="/users"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#2196F3',
          textDecoration: 'none',
          marginBottom: '24px',
          fontSize: '14px'
        }}
      >
        ← 返回用户列表
      </Link>

      {/* 用户信息头部 */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
              用户 {userId}
            </h2>
            <div style={{ display: 'flex', gap: '24px', color: '#666' }}>
              <span>📊 {profile.totalRatings} 条评分</span>
              <span>⭐ 平均 {profile.averageScore} 分</span>
            </div>
          </div>
          <div style={{
            padding: '8px 16px',
            background: profile.sentiment.overallSentiment === 'positive' ? '#e8f5e9' :
              profile.sentiment.overallSentiment === 'negative' ? '#ffebee' : '#f5f5f5',
            color: profile.sentiment.overallSentiment === 'positive' ? '#4CAF50' :
              profile.sentiment.overallSentiment === 'negative' ? '#f44336' : '#666',
            borderRadius: '4px',
            fontWeight: '500'
          }}>
            {profile.sentiment.overallSentiment === 'positive' ? '😊 积极用户' :
              profile.sentiment.overallSentiment === 'negative' ? '😞 消极用户' : '😐 中性用户'}
          </div>
        </div>
      </Card>

      {/* 图表区域 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* 分类分布 */}
        <Card title="内容分类分布">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#2196F3" name="访问次数" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* 情感分析 */}
        <Card title="情感分析">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 时间分布 */}
      <Card title="浏览时间分布" style={{ marginBottom: '24px' }}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4CAF50" name="访问次数" />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
          高峰时段：{profile.timePatterns.peakHours.map(h => `${h}:00`).join(', ')}
        </div>
      </Card>

      {/* 兴趣标签和常访网站 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* 兴趣标签 */}
        <Card title="兴趣标签">
          {profile.interests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
              暂无兴趣标签
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {profile.interests.slice(0, 15).map((interest) => (
                <div
                  key={interest.tag}
                  style={{
                    padding: '8px 16px',
                    background: '#e3f2fd',
                    color: '#2196F3',
                    borderRadius: '20px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{interest.tag}</span>
                  <span style={{
                    background: '#2196F3',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '12px'
                  }}>
                    {interest.frequency}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 常访网站 */}
        <Card title="常访网站">
          {profile.domains.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
              暂无访问记录
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profile.domains.slice(0, 10).map((domain) => (
                <div
                  key={domain.domain}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: '#f9f9f9',
                    borderRadius: '6px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                      {domain.domain}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      访问 {domain.count} 次
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    background: domain.averageScore >= 7 ? '#e8f5e9' :
                      domain.averageScore >= 4 ? '#fff3e0' : '#ffebee',
                    color: domain.averageScore >= 7 ? '#4CAF50' :
                      domain.averageScore >= 4 ? '#FF9800' : '#f44336',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {domain.averageScore} 分
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
