import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Note } from '@/types';
import {
  Card,
  CardContent,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui';
import { useNotes } from '@/context/NotesContext';
import { Search, SlidersHorizontal } from 'lucide-react';

// Subject categories for filtering
const SUBJECTS = [
  'All Subjects',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'History',
  'Literature',
  'Engineering'
];

export default function NotesPage() {
  const { notes, fetchNotes } = useNotes();
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subject, setSubject] = useState('All Subjects');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const notesPerPage = 9;
  
  useEffect(() => {
    // Fetch notes when component mounts
    fetchNotes();
  }, [fetchNotes]);
  
  useEffect(() => {
    // Filter and sort notes based on search query, subject, and sort option
    let result = [...notes];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.description.toLowerCase().includes(query) ||
        (note.tags && note.tags.some((tag: string) => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply subject filter
    if (subject !== 'All Subjects') {
      result = result.filter(note => note.subject === subject);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'popular':
        result.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    
    setFilteredNotes(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [notes, searchQuery, subject, sortBy]);
  
  // Get current notes for pagination
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);
  
  // Pagination handler
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Browse Notes</h1>
          <p className="text-muted-foreground mt-1">
            Discover high-quality study notes shared by students
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} />
            Filters
          </Button>
          <Button as={Link} to="/upload" variant="default">
            Upload Notes
          </Button>
        </div>
      </div>
      
      <div className={`bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((subj) => (
                <SelectItem key={subj} value={subj}>
                  {subj}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="grid" className="mb-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <span className="text-sm text-muted-foreground">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
          </span>
        </div>
        
        <TabsContent value="grid" className="mt-6">
          {currentNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentNotes.map((note) => (
                <Link to={`/notes/${note.id}`} key={note.id}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
                      {note.coverImage ? (
                        <img
                          src={note.coverImage}
                          alt={note.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90 dark:bg-black/70 backdrop-blur-sm">
                          {note.format || 'PDF'}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium line-clamp-1">{note.title}</h3>
                        <div className="flex items-center text-yellow-500">
                          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                          </svg>
                          <span className="text-xs ml-1">{note.rating || '4.5'}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {note.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{note.subject}</span>
                        <span>{note.downloads || 0} downloads</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No notes found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button as={Link} to="/upload" variant="outline">
                Upload Your Notes
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          {currentNotes.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {currentNotes.map((note) => (
                <Link to={`/notes/${note.id}`} key={note.id}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-40 md:h-auto bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                          {note.coverImage ? (
                            <img
                              src={note.coverImage}
                              alt={note.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{note.title}</h3>
                            <div className="flex items-center">
                              <Badge variant="secondary" className="mr-2">
                                {note.format || 'PDF'}
                              </Badge>
                              <div className="flex items-center text-yellow-500">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                  <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                                </svg>
                                <span className="text-xs ml-1">{note.rating || '4.5'}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {note.description}
                          </p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex items-center space-x-4">
                              <span>{note.subject}</span>
                              <span>{note.downloads || 0} downloads</span>
                            </div>
                            <span>
                              {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No notes found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button as={Link} to="/upload" variant="outline">
                Upload Your Notes
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => paginate(currentPage - 1)}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {/* Show first page */}
            {currentPage > 2 && (
              <PaginationItem>
                <Button 
                  variant={currentPage === 1 ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => paginate(1)}
                  className="w-9 h-9 p-0"
                >
                  1
                </Button>
              </PaginationItem>
            )}
            
            {/* Show ellipsis if needed */}
            {currentPage > 3 && (
              <PaginationItem>
                <span className="px-2">...</span>
              </PaginationItem>
            )}
            
            {/* Show current page and adjacent pages */}
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              let pageNum;
              if (currentPage === 1) {
                pageNum = currentPage + i;
              } else if (currentPage === totalPages) {
                pageNum = currentPage - 2 + i;
              } else {
                pageNum = currentPage - 1 + i;
              }
              
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <PaginationItem key={pageNum}>
                    <Button 
                      variant={pageNum === currentPage ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => paginate(pageNum)}
                      className="w-9 h-9 p-0"
                    >
                      {pageNum}
                    </Button>
                  </PaginationItem>
                );
              }
              return null;
            })}
            
            {/* Show ellipsis if needed */}
            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <span className="px-2">...</span>
              </PaginationItem>
            )}
            
            {/* Show last page */}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <Button 
                  variant={currentPage === totalPages ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => paginate(totalPages)}
                  className="w-9 h-9 p-0"
                >
                  {totalPages}
                </Button>
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => paginate(currentPage + 1)}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}