import { useState } from 'react'
import { profileApi } from '../api'
import Card from '../components/Card'

export default function Compare() {
  const [user1, setUser1] = useState('')
  const [user2, setUser2] = useState('')
  const [similarity, setSimilarity] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCompare = async () => {
    if (!user1 || !user2) {
      setError('请输入两个用户 ID')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await profileApi.compareUsers(user1, user2)
      setSimilarity(result.similarity)
    } catch (err: any) {
      setError(err.message || '比较失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
        用户相似度对比
      </h2>

      <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              用户 1 ID
            </label>
            <input
              type="text"
              value={user1}
              onChange={(e) => setUser1(e.target.value)}
              placeholder="输入用户 ID"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              用户 2 ID
            </label>
            <input
              type="text"
              value={user2}
              onChange={(e) => setUser2(e.target.value)}
              placeholder="输入用户 ID"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: '#ffebee',
              color: '#f44336',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleCompare}
            disabled={loading}
            style={{
              padding: '12px',
              background: loading ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '比较中...' : '开始比较'}
          </button>

          {similarity !== null && (
            <div style={{
              marginTop: '24px',
              padding: '32px',
              background: '#f5f5f5',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                相似度
              </div>
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: similarity >= 0.7 ? '#4CAF50' :
                  similarity >= 0.4 ? '#FF9800' : '#f44336',
                marginBottom: '12px'
              }}>
                {(similarity * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {similarity >= 0.7 ? '非常相似' :
                  similarity >= 0.4 ? '中等相似' : '相似度较低'}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
