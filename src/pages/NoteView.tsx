import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Note, Comment } from '@/types';
import {
  Button,
  Card,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Avatar,
  Badge,
  Separator
} from '@/components/ui';
import { useNotes } from '@/context/NotesContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Download, Share2, Star, Bookmark, Flag, ThumbsUp, MessageSquare, Eye } from 'lucide-react';

export default function NoteView() {
  const { id } = useParams<{ id: string }>();
  const { getNoteById, addComment, rateNote } = useNotes();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  
  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        if (id) {
          const noteData = await getNoteById(id);
          if (noteData) {
            setNote(noteData);
            // If note has preview URL, set it
            if (noteData.previewUrl) {
              setPreviewUrl(noteData.previewUrl);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching note:', error);
        toast({
          title: "Error",
          description: "Failed to load the note. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchNote();
  }, [id, getNoteById, toast]);
  
  const handleDownload = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to download notes.",
        variant: "default",
      });
      return;
    }
    
    // Implement download logic here
    toast({
      title: "Download Started",
      description: "Your file is being downloaded.",
    });
  };
  
  const handleShare = () => {
    // Copy current URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Share link copied to clipboard",
    });
  };
  
  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to bookmark notes.",
        variant: "default",
      });
      return;
    }
    
    // Implement bookmark logic here
    toast({
      title: "Bookmarked!",
      description: "Note has been added to your bookmarks.",
    });
  };
  
  const handleRating = async (rating: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to rate notes.",
        variant: "default",
      });
      return;
    }
    
    setUserRating(rating);
    try {
      await rateNote(id as string, rating);
      toast({
        title: "Rating Submitted!",
        description: "Thank you for your feedback.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to post comments.",
        variant: "default",
      });
      return;
    }
    
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addComment(id as string, comment);
      setComment('');
      toast({
        title: "Comment Posted!",
        description: "Your comment has been added.",
      });
      
      // Refresh note data to see the new comment
      const updatedNote = await getNoteById(id as string);
      if (updatedNote) {
        setNote(updatedNote);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const handleReport = () => {
    // Implement report logic here
    toast({
      title: "Report Submitted",
      description: "Thank you for your feedback. Our team will review this content.",
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading note...</p>
        </div>
      </div>
    );
  }
  
  if (!note) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Note Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The note you're looking for doesn't exist or has been removed.
        </p>
        <Button as={Link} to="/notes">Browse All Notes</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-grow">
          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground mb-4">
            <Link to="/notes" className="hover:text-primary">Notes</Link>
            <span className="mx-2">/</span>
            <Link to={`/notes?subject=${encodeURIComponent(note.subject || '')}`} className="hover:text-primary">{note.subject}</Link>
            <span className="mx-2">/</span>
            <span>{note.title}</span>
          </div>
          
          {/* Note Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {note.subject}
              </Badge>
              <div className="flex items-center">
                <Badge variant="secondary" className="mr-2">
                  {note.format || 'PDF'}
                </Badge>
                <div className="flex items-center text-yellow-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star 
                      key={index} 
                      size={16} 
                      className={index < (note.rating || 0) ? "fill-yellow-500" : "fill-gray-200 text-gray-200"}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                    ({note.numRatings || 0})
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{note.title}</h1>
            <p className="text-muted-foreground">{note.description}</p>
          </div>
          
          {/* Note Stats */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Eye size={16} className="mr-1" />
              <span>{note.views || 0} views</span>
            </div>
            <div className="flex items-center">
              <Download size={16} className="mr-1" />
              <span>{note.downloads || 0} downloads</span>
            </div>
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-1" />
              <span>{note.comments?.length || 0} comments</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp size={16} className="mr-1" />
              <span>{note.likes || 0} likes</span>
            </div>
          </div>
          
          {/* Note Content */}
          <Card className="mb-8">
            <Tabs defaultValue="preview" onValueChange={setActiveTab}>
              <TabsList className="w-full border-b rounded-none justify-start">
                <TabsTrigger value="preview" className="flex-grow max-w-[200px]">
                  Preview
                </TabsTrigger>
                <TabsTrigger value="details" className="flex-grow max-w-[200px]">
                  Details
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="p-0">
                <div className="bg-gray-100 dark:bg-gray-800 min-h-[400px] flex items-center justify-center">
                  {previewUrl ? (
                    <iframe 
                      src={previewUrl} 
                      className="w-full h-[600px]"
                      title={note.title}
                    ></iframe>
                  ) : (
                    <div className="text-center p-8">
                      <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="text-lg font-medium mb-2">Preview not available</h3>
                      <p className="text-muted-foreground mb-4">
                        Download the full document to view its contents
                      </p>
                      <Button onClick={handleDownload}>
                        <Download size={16} className="mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                <CardContent className="space-y-4 p-6">
                  <div>
                    <h3 className="font-medium mb-1">Subject</h3>
                    <p>{note.subject}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Course/Class</h3>
                    <p>{note.course || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Institution</h3>
                    <p>{note.institution || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Year</h3>
                    <p>{note.year || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {note.tags && note.tags.length > 0 ? (
                        note.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="outline">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No tags</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
          
          {/* Comments Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Comments</h2>
            
            {/* Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary mb-2">
                  <textarea
                    className="w-full p-3 focus:outline-none bg-background"
                    rows={4}
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Post Comment</Button>
                </div>
              </form>
            ) : (
              <Card className="mb-8 bg-muted/50">
                <CardContent className="p-4 text-center">
                  <p className="mb-2">Please log in to leave a comment</p>
                  <Button as={Link} to="/login" variant="outline" size="sm">
                    Log In
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Comments List */}
            <div className="space-y-6">
              {note.comments && note.comments.length > 0 ? (
                note.comments.map((comment: Record<string, unknown>, index: number) => (
                  <div key={index} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <img 
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author || 'User'}`} 
                          alt={comment.author} 
                        />
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{comment.author}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {/* Add dropdown for comment options if needed */}
                        </div>
                        <p className="mt-2">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-20">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                  <Button onClick={handleDownload} className="w-full">
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 size={16} className="mr-1" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleBookmark}>
                      <Bookmark size={16} className="mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReport}>
                      <Flag size={16} className="mr-1" />
                      Report
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Rate this note</p>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleRating(index + 1)}
                          className="text-gray-300 hover:text-yellow-500 p-1"
                        >
                          <Star 
                            size={24} 
                            className={index < userRating ? "fill-yellow-500 text-yellow-500" : ""}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${note.author || 'User'}`} 
                      alt={note.author} 
                    />
                  </Avatar>
                  <div>
                    <p className="font-medium">{note.author || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date((note.authorJoinDate || Date.now())).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 text-center">
                  <div>
                    <p className="font-bold">{note.authorNotesCount || 0}</p>
                    <p className="text-xs text-muted-foreground">Notes</p>
                  </div>
                  <div>
                    <p className="font-bold">{note.authorRating || 0}</p>
                    <p className="text-xs text-muted-foreground">Avg. Rating</p>
                  </div>
                </div>
                
                <Link to={`/profile/${note.authorId}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Related Notes */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Related Notes</h3>
                
                {note.relatedNotes && note.relatedNotes.length > 0 ? (
                  <div className="space-y-4">
                    {note.relatedNotes.slice(0, 3).map((relatedNote: Record<string, unknown>, index: number) => (
                      <Link to={`/notes/${relatedNote.id}`} key={index}>
                        <div className="flex gap-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0"></div>
                          <div>
                            <p className="font-medium line-clamp-1">{relatedNote.title}</p>
                            <p className="text-xs text-muted-foreground">{relatedNote.subject}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No related notes found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}