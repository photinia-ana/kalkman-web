import axios from 'axios'
import { UserProfile } from '../types'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

export const profileApi = {
  // 获取单个用户画像
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    const { data } = await api.get(`/profile/${userId}`)
    return data.data
  },

  // 获取所有用户画像
  getAllProfiles: async (): Promise<Record<string, UserProfile>> => {
    const { data } = await api.get('/profile')
    return data.data
  },

  // 获取用户兴趣标签
  getUserInterests: async (userId: string, limit: number = 10) => {
    const { data } = await api.get(`/profile/${userId}/interests`, {
      params: { limit },
    })
    return data.data
  },

  // 比较用户相似度
  compareUsers: async (user1: string, user2: string) => {
    const { data } = await api.get('/profile/compare/similarity', {
      params: { user1, user2 },
    })
    return data.data
  },
}

// 视频资源 API
export const videoApi = {
  // 获取用户视频列表
  getUserVideos: async (
    userId: string,
    options?: {
      limit?: number
      offset?: number
      category?: string
      sourceDomain?: string
      ranked?: boolean
    }
  ) => {
    const endpoint = options?.ranked
      ? `/resources/user/${userId}/ranked`
      : `/resources/user/${userId}`

    const { data } = await api.get(endpoint, {
      params: {
        limit: options?.limit,
        offset: options?.offset,
        category: options?.category,
        sourceDomain: options?.sourceDomain,
      },
    })
    return data.data
  },

  // 获取视频统计
  getVideoStats: async (userId: string) => {
    const { data } = await api.get(`/resources/user/${userId}/stats`)
    return data.data
  },
}

// 推荐 API
export const recommendationApi = {
  // 获取推荐视频
  getRecommendations: async (
    userId: string,
    limit: number = 20,
    minScore: number = 0.3
  ) => {
    const { data } = await api.get(`/recommendations/user/${userId}`, {
      params: { limit, minScore },
    })
    return data.data
  },

  // 获取相似视频
  getSimilarVideos: async (
    videoId: string,
    userId: string,
    limit: number = 10
  ) => {
    const { data } = await api.get(`/recommendations/similar/${videoId}`, {
      params: { userId, limit },
    })
    return data.data
  },

  // 批量精排
  batchRank: async (userId: string, videos: any[]) => {
    const { data } = await api.post('/recommendations/batch-rank', {
      userId,
      videos,
    })
    return data.data
  },
}

export default api
