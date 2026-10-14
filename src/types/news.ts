export type NewsCategory = 
  | 'जशपुर'
  | 'छत्तीसगढ़'
  | 'सरगुजा संभाग'
  | 'बिलासपुर संभाग'
  | 'रायपुर संभाग'
  | 'दुर्ग संभाग'
  | 'बस्तर संभाग'
  | 'राजनीति'
  | 'अपराध'
  | 'शिक्षा'
  | 'खेल'
  | 'मनोरंजन'
  | 'देश-दुनिया'
  | 'व्यापार';

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  location: string;
}

export interface NewsComment {
  id: string;
  authorName: string;
  city: string;
  comment: string;
  timestamp: string;
  likes: number;
}

export type ArticleStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string[];
  category: NewsCategory;
  subLocation?: string; // e.g. "जशपुर नगर", "पत्थलगांव", "कुनकुरी", "बगीचा", "रायपुर"
  imageUrl: string;
  imageCaption?: string;
  author: Author;
  authorId?: string;
  authorName?: string;
  authorRole?: string;
  publishedAt: string; // e.g. "12 अक्टूबर 2026, 04:30 अपराह्न"
  readTime: string; // e.g. "3 मिनट"
  isBreaking?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  views: number;
  keyPoints?: string[];
  comments?: NewsComment[];
  status?: ArticleStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MandiRate {
  crop: string;
  market: string;
  rate: string;
  change: 'up' | 'down' | 'steady';
}
