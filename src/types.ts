export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'major_admin' | 'user';
  majorId?: string; // For major_admin
  createdAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  authorUid: string;
  imageUrl?: string;
  category?: string;
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
  longDescription?: string;
  icon: string;
  color?: string;
  skills?: string[];
  prospects?: string[];
  adminEmail?: string;
}
