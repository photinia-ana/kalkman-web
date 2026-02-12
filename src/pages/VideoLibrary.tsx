import { useState, useEffect } from 'react';
import { videoApi, recommendationApi } from '../api';

interface Video {
  id: string;
  title: string;
  url: string;
  author?: string;
  duration?: string;
  cover?: string;
  category?: string;
  tags?: string[];
  source_domain: string;
  extracted_at: string;
  score?: number;
  scoreBreakdown?: {
    category: number;
    tags: number;
    author: number;
    domain: number;
    duration: number;
    freshness: number;
  };
}

interface VideoStats {
  total: number;
  byCategory: Record<string, number>;
  byDomain: Record<string, number>;
}

export default function VideoLibrary() {
  const [userId, setUserId] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [stats, setStats] = useState<VideoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'recommended' | 'all'>('recommended');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');

  const loadRecommendations = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await recommendationApi.getRecommendations(userId, 50);
      setVideos(data);
    } catch (error) {
      console.error('加载推荐失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllVideos = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const data = await videoApi.getUserVideos(userId, {
        limit: 50,
        category: selectedCategory || undefined,
        sourceDomain: selectedDomain || undefined,
        ranked: true,
      });
      setVideos(data);
    } catch (error) {
      console.error('加载视频失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!userId) return;
    
    try {
      const data = await videoApi.getVideoStats(userId);
      setStats(data);
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      loadStats();
      if (viewMode === 'recommended') {
        loadRecommendations();
      } else {
        loadAllVideos();
      }
    }
  }, [userId, viewMode, selectedCategory, selectedDomain]);

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return '#4CAF50';
    if (score >= 0.5) return '#FF9800';
    return '#999';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return '强烈推荐';
    if (score >= 0.6) return '推荐';
    if (score >= 0.4) return '可能喜欢';
    return '一般';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>视频资源库</h1>

      {/* 用户输入 */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="输入用户 ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '300px',
          }}
        />
      </div>

      {/* 统计信息 */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px',
        }}>
          <div style={{
            padding: '15px',
            background: '#f5f5f5',
            borderRadius: '8px',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              总视频数
            </div>
          </div>

          <div style={{
            padding: '15px',
            background: '#f5f5f5',
            borderRadius: '8px',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              {Object.keys(stats.byCategory).length}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              分类数
            </div>
          </div>

          <div style={{
            padding: '15px',
            background: '#f5f5f5',
            borderRadius: '8px',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              {Object.keys(stats.byDomain).length}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              平台数
            </div>
          </div>
        </div>
      )}

      {/* 视图切换 */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        alignItems: 'center',
      }}>
        <button
          onClick={() => setViewMode('recommended')}
          style={{
            padding: '10px 20px',
            background: viewMode === 'recommended' ? '#1976d2' : '#fff',
            color: viewMode === 'recommended' ? '#fff' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: viewMode === 'recommended' ? 'bold' : 'normal',
          }}
        >
          🎯 为你推荐
        </button>

        <button
          onClick={() => setViewMode('all')}
          style={{
            padding: '10px 20px',
            background: viewMode === 'all' ? '#1976d2' : '#fff',
            color: viewMode === 'all' ? '#fff' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: viewMode === 'all' ? 'bold' : 'normal',
          }}
        >
          📚 全部视频
        </button>

        {viewMode === 'all' && stats && (
          <>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <option value="">全部分类</option>
              {Object.keys(stats.byCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({stats.byCategory[cat]})
                </option>
              ))}
            </select>

            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <option value="">全部平台</option>
              {Object.keys(stats.byDomain).map((domain) => (
                <option key={domain} value={domain}>
                  {domain} ({stats.byDomain[domain]})
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* 视频列表 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          加载中...
        </div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          {userId ? '暂无视频数据' : '请输入用户 ID'}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {videos.map((video) => (
            <div
              key={video.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#fff',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => window.open(video.url, '_blank')}
            >
              {/* 封面 */}
              {video.cover && (
                <div style={{
                  width: '100%',
                  height: '180px',
                  background: `url(${video.cover}) center/cover`,
                  position: 'relative',
                }}>
                  {video.duration && (
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontSize: '12px',
                    }}>
                      {video.duration}
                    </div>
                  )}
                </div>
              )}

              {/* 内容 */}
              <div style={{ padding: '15px' }}>
                {/* 推荐分数 */}
                {video.score !== undefined && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                  }}>
                    <div style={{
                      background: getScoreColor(video.score),
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}>
                      {(video.score * 100).toFixed(0)}分
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {getScoreLabel(video.score)}
                    </div>
                  </div>
                )}

                {/* 标题 */}
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  lineHeight: '1.4',
                  height: '40px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {video.title}
                </div>

                {/* 作者 */}
                {video.author && (
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '8px',
                  }}>
                    👤 {video.author}
                  </div>
                )}

                {/* 分类和平台 */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '8px',
                  flexWrap: 'wrap',
                }}>
                  {video.category && (
                    <span style={{
                      background: '#e3f2fd',
                      color: '#1976d2',
                      padding: '2px 8px',
                      borderRadius: '3px',
                      fontSize: '11px',
                    }}>
                      {video.category}
                    </span>
                  )}
                  <span style={{
                    background: '#f5f5f5',
                    color: '#666',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    fontSize: '11px',
                  }}>
                    {video.source_domain}
                  </span>
                </div>

                {/* 标签 */}
                {video.tags && video.tags.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    flexWrap: 'wrap',
                    marginBottom: '8px',
                  }}>
                    {video.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#fff3e0',
                          color: '#f57c00',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '10px',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 推荐原因 */}
                {video.scoreBreakdown && (
                  <div style={{
                    fontSize: '11px',
                    color: '#999',
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid #f0f0f0',
                  }}>
                    推荐原因：
                    {video.scoreBreakdown.category > 0.1 && ' 分类匹配'}
                    {video.scoreBreakdown.tags > 0.1 && ' 标签相关'}
                    {video.scoreBreakdown.author > 0.05 && ' 喜欢的作者'}
                  </div>
                )}

                {/* 采集时间 */}
                <div style={{
                  fontSize: '10px',
                  color: '#ccc',
                  marginTop: '8px',
                }}>
                  {new Date(video.extracted_at).toLocaleDateString('zh-CN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
