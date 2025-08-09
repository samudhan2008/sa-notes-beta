# SA Notes - System Architecture

This document outlines the system architecture for the SA Notes platform - a user-driven online platform for sharing and discovering educational notes.

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx - Main navigation header
│   │   ├── Footer.tsx - Site footer
│   │   └── Layout.tsx - Main layout wrapper
│   ├── auth/
│   │   ├── LoginForm.tsx - User login
│   │   ├── RegisterForm.tsx - New user registration
│   │   └── ForgotPasswordForm.tsx - Password recovery
│   ├── notes/
│   │   ├── NoteCard.tsx - Note display component
│   │   ├── NoteUploadForm.tsx - Note submission form
│   │   ├── NotePreview.tsx - Note preview component
│   │   └── NoteList.tsx - List of notes with filtering
│   ├── search/
│   │   ├── SearchBar.tsx - Main search input
│   │   └── SearchResults.tsx - Display search results
│   ├── dashboard/
│   │   ├── UserStats.tsx - User activity metrics
│   │   └── UserNotes.tsx - User's uploaded notes
│   └── ui/ - shadcn/ui components
├── pages/
│   ├── Home.tsx - Landing page
│   ├── Login.tsx - Login page
│   ├── Register.tsx - Registration page
│   ├── Dashboard.tsx - User dashboard
│   ├── Search.tsx - Search page
│   ├── NoteView.tsx - Individual note view
│   └── Admin.tsx - Admin panel
├── context/
│   ├── AuthContext.tsx - Authentication state
│   ├── NotesContext.tsx - Notes data management
│   └── ThemeContext.tsx - Theme preferences
└── lib/
    ├── types.ts - TypeScript types/interfaces
    └── utils.ts - Utility functions
```

### State Management

The application uses React Context API for state management:

- **AuthContext** - Manages user authentication state
- **NotesContext** - Manages notes data
- **ThemeContext** - Manages dark/light theme

### Data Models

#### User

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  createdAt: string;
}
```

#### Note

```typescript
interface Note {
  id: string;
  title: string;
  description: string;
  conceptName: string;
  tags: string[];
  fileUrl: string;
  fileType: 'PDF' | 'DOCX' | 'TXT';
  userId: string;
  userName: string;
  rating: number;
  downloadCount: number;
  viewCount: number;
  createdAt: string;
}
```

### LocalStorage Structure

For the initial implementation using localStorage:

```typescript
// User authentication
localStorage.setItem('saNotesUser', JSON.stringify({
  id: 'user-id',
  username: 'username',
  email: 'user@example.com',
  role: 'user'
}));

// Notes data
localStorage.setItem('saNotes', JSON.stringify([
  // Array of Note objects
]));

// User bookmarks
localStorage.setItem('saNotesBookmarks', JSON.stringify([
  // Array of bookmarked note IDs
]));

// Theme preference
localStorage.setItem('theme', 'light');
```

## Implementation Phases

Following the phases outlined in the PRD:

### Phase 1: Core Functionality
- Basic user authentication with localStorage
- Note upload and management
- Simple search
- User dashboard
- Dark/light theme toggle

### Phase 2: Enhanced Features
- Google search integration
- Advanced search filters
- Note rating system
- Bookmarking functionality

### Phase 3: Advanced Features
- More features to be implemented as specified in the PRD