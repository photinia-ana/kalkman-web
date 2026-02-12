export interface UserProfile {
  userId: string
  totalRatings: number
  averageScore: number
  categories: CategoryScore[]
  domains: DomainScore[]
  timePatterns: TimePattern
  interests: InterestTag[]
  sentiment: SentimentAnalysis
}

export interface CategoryScore {
  category: string
  count: number
  averageScore: number
  weight: number
}

export interface DomainScore {
  domain: string
  count: number
  averageScore: number
  lastVisited: string
}

export interface TimePattern {
  hourlyDistribution: Record<number, number>
  weekdayDistribution: Record<number, number>
  peakHours: number[]
}

export interface InterestTag {
  tag: string
  weight: number
  frequency: number
}

export interface SentimentAnalysis {
  positive: number
  neutral: number
  negative: number
  overallSentiment: 'positive' | 'neutral' | 'negative'
}
