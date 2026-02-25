export interface User {
  id: string;
  email: string;
  role: 'brand' | 'influencer';
  is_active: boolean;
  created_at: string;
}

export interface InfluencerProfile {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  categories: string[] | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  youtube_handle: string | null;
  follower_count: number;
  engagement_rate: number;
  avg_likes: number;
  avg_comments: number;
  audience_top_country: string | null;
  audience_age_range: string | null;
  audience_gender_split: Record<string, number> | null;
  authenticity_score: number;
  fake_follower_pct: number;
  price_per_post: number | null;
  location: string | null;
  is_verified: boolean;
}

export interface BrandProfile {
  id: string;
  user_id: string;
  company_name: string;
  logo_url: string | null;
  industry: string | null;
  website: string | null;
  description: string | null;
}

export interface Campaign {
  id: string;
  brand_id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  budget: number | null;
  price_per_influencer: number | null;
  category: string | null;
  min_followers: number | null;
  min_engagement_rate: number | null;
  platform: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  max_influencers: number | null;
  created_at: string;
  brand_name: string | null;
  application_count: number | null;
}

export interface Application {
  id: string;
  campaign_id: string;
  influencer_id: string;
  status: string;
  pitch: string | null;
  created_at: string;
  influencer_name?: string | null;
  influencer_avatar?: string | null;
  campaign_title?: string | null;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface MeResponse {
  user: User;
  profile: InfluencerProfile | BrandProfile | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface NaturalSearchResponse {
  query: string;
  interpreted_filters: Record<string, any>;
  results: InfluencerProfile[];
  total: number;
}
