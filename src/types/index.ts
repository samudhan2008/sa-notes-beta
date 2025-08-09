// User types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  institution?: string;
  profileImage?: string;
  joinDate?: string;
  isAdmin?: boolean;
}

// Note types
export interface Note {
  id: string;
  title: string;
  description: string;
  content?: string;
  author: string;
  authorId: string;
  authorJoinDate?: string;
  authorNotesCount?: number;
  authorRating?: number;
  subject: string;
  course?: string;
  institution?: string;
  year?: string;
  format?: string;
  tags?: string[];
  coverImage?: string;
  previewUrl?: string;
  downloads?: number;
  views?: number;
  likes?: number;
  rating?: number;
  numRatings?: number;
  comments?: Comment[];
  relatedNotes?: Note[];
  createdAt: string;
  updatedAt?: string;
}

// Comment types
export interface Comment {
  id: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: string;
}

// Report types
export interface Report {
  id: number;
  title: string;
  author: string;
  reportCount: number;
  reportType: 'copyright' | 'inappropriate' | 'plagiarism' | 'other';
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
  reportDate: string;
}

// Activity types
export interface Activity {
  type: 'download' | 'upload' | 'rating' | 'comment';
  note: string;
  timestamp: Date;
  rating?: number;
  comment?: string;
}

// Context types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export interface NotesContextType {
  notes: Note[];
  fetchNotes: () => Promise<Note[]>;
  searchNotes: (query: string) => Promise<Note[]>;
  getNoteById: (id: string) => Promise<Note | null>;
  uploadNote: (noteData: Partial<Note>) => Promise<boolean>;
  addComment: (noteId: string, comment: string) => Promise<boolean>;
  rateNote: (noteId: string, rating: number) => Promise<boolean>;
  fetchUserNotes: () => Promise<Note[]>;
  fetchBookmarkedNotes: () => Promise<Note[]>;
}

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}