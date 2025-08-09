import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define types for notes
export interface Note {
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

// Define the context type
interface NotesContextType {
  notes: Note[];
  userNotes: Note[];
  bookmarkedNotes: Note[];
  loading: boolean;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'downloadCount' | 'viewCount' | 'rating'>) => Promise<Note>;
  updateNote: (id: string, note: Partial<Note>) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
  getNoteById: (id: string) => Note | undefined;
  bookmarkNote: (id: string) => void;
  removeBookmark: (id: string) => void;
  incrementDownload: (id: string) => void;
  incrementView: (id: string) => void;
  rateNote: (id: string, rating: number) => void;
  searchNotes: (query: string, filters?: { tags?: string[], conceptName?: string }) => Note[];
}

// Create the context
const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Create a provider component
export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load notes and bookmarks from localStorage on mount
  useEffect(() => {
    const loadNotes = () => {
      try {
        const savedNotes = localStorage.getItem('saNotes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        } else {
          // Initialize with some sample data if empty
          const sampleNotes = getSampleNotes();
          localStorage.setItem('saNotes', JSON.stringify(sampleNotes));
          setNotes(sampleNotes);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
        setNotes([]);
      }
    };

    const loadBookmarks = () => {
      try {
        const savedBookmarks = localStorage.getItem('saNotesBookmarks');
        if (savedBookmarks) {
          setBookmarks(JSON.parse(savedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
        setBookmarks([]);
      }
    };

    loadNotes();
    loadBookmarks();
    setLoading(false);
  }, []);

  // Get user's notes
  const userNotes = user ? notes.filter(note => note.userId === user.id) : [];

  // Get bookmarked notes
  const bookmarkedNotes = notes.filter(note => bookmarks.includes(note.id));

  // Add a new note
  const addNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'downloadCount' | 'viewCount' | 'rating'>): Promise<Note> => {
    const newNote: Note = {
      ...noteData,
      id: `note-${Date.now()}`,
      rating: 0,
      downloadCount: 0,
      viewCount: 0,
      createdAt: new Date().toISOString()
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem('saNotes', JSON.stringify(updatedNotes));
    return newNote;
  };

  // Update an existing note
  const updateNote = async (id: string, noteUpdate: Partial<Note>): Promise<boolean> => {
    try {
      const noteIndex = notes.findIndex(note => note.id === id);
      if (noteIndex === -1) return false;

      const updatedNotes = [...notes];
      updatedNotes[noteIndex] = {
        ...updatedNotes[noteIndex],
        ...noteUpdate
      };

      setNotes(updatedNotes);
      localStorage.setItem('saNotes', JSON.stringify(updatedNotes));
      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      return false;
    }
  };

  // Delete a note
  const deleteNote = async (id: string): Promise<boolean> => {
    try {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem('saNotes', JSON.stringify(updatedNotes));
      
      // Also remove from bookmarks if present
      if (bookmarks.includes(id)) {
        removeBookmark(id);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  };

  // Get a note by ID
  const getNoteById = (id: string): Note | undefined => {
    return notes.find(note => note.id === id);
  };

  // Bookmark a note
  const bookmarkNote = (id: string) => {
    if (!bookmarks.includes(id)) {
      const updatedBookmarks = [...bookmarks, id];
      setBookmarks(updatedBookmarks);
      localStorage.setItem('saNotesBookmarks', JSON.stringify(updatedBookmarks));
    }
  };

  // Remove a bookmark
  const removeBookmark = (id: string) => {
    const updatedBookmarks = bookmarks.filter(bookmarkId => bookmarkId !== id);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('saNotesBookmarks', JSON.stringify(updatedBookmarks));
  };

  // Increment download count
  const incrementDownload = (id: string) => {
    const note = notes.find(note => note.id === id);
    if (note) {
      updateNote(id, { downloadCount: note.downloadCount + 1 });
    }
  };

  // Increment view count
  const incrementView = (id: string) => {
    const note = notes.find(note => note.id === id);
    if (note) {
      updateNote(id, { viewCount: note.viewCount + 1 });
    }
  };

  // Rate a note
  const rateNote = (id: string, rating: number) => {
    const note = notes.find(note => note.id === id);
    if (note) {
      // In a real app, we would store individual ratings and calculate an average
      updateNote(id, { rating: rating });
    }
  };

  // Search notes
  const searchNotes = (query: string, filters?: { tags?: string[], conceptName?: string }): Note[] => {
    const searchLower = query.toLowerCase();
    
    return notes.filter(note => {
      // Basic text search
      const matchesQuery = 
        note.title.toLowerCase().includes(searchLower) ||
        note.description.toLowerCase().includes(searchLower) ||
        note.conceptName.toLowerCase().includes(searchLower) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      // Apply filters if present
      const matchesTags = !filters?.tags?.length || 
        note.tags.some(tag => filters.tags!.includes(tag));
      
      const matchesConcept = !filters?.conceptName || 
        note.conceptName.toLowerCase() === filters.conceptName.toLowerCase();
      
      return matchesQuery && matchesTags && matchesConcept;
    });
  };

  // Sample data generator
  const getSampleNotes = (): Note[] => {
    return [
      {
        id: 'note-1',
        title: 'Introduction to Neural Networks',
        description: 'Comprehensive notes on neural network fundamentals, including perceptrons, activation functions, and backpropagation.',
        conceptName: 'Artificial Intelligence',
        tags: ['AI', 'Neural Networks', 'Deep Learning'],
        fileUrl: '/sample-notes/neural-networks.pdf',
        fileType: 'PDF',
        userId: 'user-1',
        userName: 'AI Professor',
        rating: 4.7,
        downloadCount: 1250,
        viewCount: 3800,
        createdAt: '2023-01-15T08:30:00Z'
      },
      {
        id: 'note-2',
        title: 'Data Structures Explained',
        description: 'Clear explanations of essential data structures including arrays, linked lists, trees, and hash tables with implementation examples.',
        conceptName: 'Computer Science',
        tags: ['Data Structures', 'Algorithms', 'Computer Science'],
        fileUrl: '/sample-notes/data-structures.pdf',
        fileType: 'PDF',
        userId: 'user-2',
        userName: 'CS Teacher',
        rating: 4.9,
        downloadCount: 2100,
        viewCount: 5300,
        createdAt: '2023-02-20T14:45:00Z'
      },
      {
        id: 'note-3',
        title: 'Organic Chemistry Reaction Mechanisms',
        description: 'Detailed notes on organic chemistry reaction mechanisms, including nucleophilic substitution, elimination, and addition reactions.',
        conceptName: 'Chemistry',
        tags: ['Organic Chemistry', 'Reaction Mechanisms', 'Chemistry'],
        fileUrl: '/sample-notes/organic-chemistry.pdf',
        fileType: 'PDF',
        userId: 'user-3',
        userName: 'Chemistry Expert',
        rating: 4.5,
        downloadCount: 890,
        viewCount: 2100,
        createdAt: '2023-03-10T09:15:00Z'
      },
      {
        id: 'note-4',
        title: 'Calculus II - Integration Techniques',
        description: 'Comprehensive guide to integration techniques including substitution, parts, trigonometric integrals, and partial fractions.',
        conceptName: 'Mathematics',
        tags: ['Calculus', 'Integration', 'Mathematics'],
        fileUrl: '/sample-notes/calculus-integration.pdf',
        fileType: 'PDF',
        userId: 'user-4',
        userName: 'Math Tutor',
        rating: 4.8,
        downloadCount: 1750,
        viewCount: 4200,
        createdAt: '2023-04-05T11:20:00Z'
      },
      {
        id: 'note-5',
        title: 'Modern Web Development with React',
        description: 'In-depth notes on building modern web applications with React, including hooks, context API, and state management.',
        conceptName: 'Web Development',
        tags: ['React', 'JavaScript', 'Web Development'],
        fileUrl: '/sample-notes/react-development.pdf',
        fileType: 'PDF',
        userId: 'user-5',
        userName: 'Frontend Dev',
        rating: 4.6,
        downloadCount: 2300,
        viewCount: 6100,
        createdAt: '2023-05-12T15:30:00Z'
      }
    ];
  };

  return (
    <NotesContext.Provider value={{
      notes,
      userNotes,
      bookmarkedNotes,
      loading,
      addNote,
      updateNote,
      deleteNote,
      getNoteById,
      bookmarkNote,
      removeBookmark,
      incrementDownload,
      incrementView,
      rateNote,
      searchNotes
    }}>
      {children}
    </NotesContext.Provider>
  );
}

// Custom hook to use the notes context
export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}