export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  authorUid: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Major {
  id: string;
  title: string;
  description: string;
  icon: string;
}
