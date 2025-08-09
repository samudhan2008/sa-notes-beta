import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Note, Activity } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Avatar,
  Badge,
  Progress
} from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useNotes } from '@/context/NotesContext';
import { 
  FilePlus, 
  Clock, 
  Star, 
  Bookmark, 
  Download, 
  Eye, 
  BarChart4, 
  ChevronRight,
  Trash2
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { fetchUserNotes, fetchBookmarkedNotes } = useNotes();
  
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [bookmarkedNotes, setBookmarkedNotes] = useState<Note[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would fetch from an API
        const myNotes = await fetchUserNotes();
        const bookmarked = await fetchBookmarkedNotes();
        
        setUserNotes(myNotes || []);
        setBookmarkedNotes(bookmarked || []);
        
        // Mock recent activity data
        setRecentActivity([
          { type: 'download', note: 'Introduction to Psychology', timestamp: new Date(Date.now() - 3600000) },
          { type: 'upload', note: 'Data Structures Notes', timestamp: new Date(Date.now() - 86400000) },
          { type: 'rating', note: 'Organic Chemistry Basics', rating: 5, timestamp: new Date(Date.now() - 172800000) },
          { type: 'comment', note: 'Linear Algebra Fundamentals', comment: 'Great notes, very helpful!', timestamp: new Date(Date.now() - 259200000) }
        ]);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchUserNotes, fetchBookmarkedNotes]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.username || 'User'}!
          </p>
        </div>
        <Button as={Link} to="/upload" className="flex items-center gap-2">
          <FilePlus size={16} />
          Upload New Notes
        </Button>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Uploads
                </p>
                <p className="text-3xl font-bold mt-1">
                  {userNotes.length}
                </p>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <FilePlus size={20} />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={Math.min((userNotes.length / 10) * 100, 100)} className="h-1" />
              <p className="text-xs text-muted-foreground mt-2">
                {10 - userNotes.length > 0 ? 
                  `${10 - userNotes.length} more to reach the next level` : 
                  'You reached the next level!'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Downloads
                </p>
                <p className="text-3xl font-bold mt-1">
                  {userNotes.reduce((sum, note) => sum + (note.downloads || 0), 0)}
                </p>
              </div>
              <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                <Download size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="text-green-500 text-xs">+12%</div>
              <p className="text-xs text-muted-foreground">
                From last month
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Views
                </p>
                <p className="text-3xl font-bold mt-1">
                  {userNotes.reduce((sum, note) => sum + (note.views || 0), 0)}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                <Eye size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="text-blue-500 text-xs">+24%</div>
              <p className="text-xs text-muted-foreground">
                From last month
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </p>
                <p className="text-3xl font-bold mt-1 flex items-center">
                  {userNotes.length ? (userNotes.reduce((sum, note) => sum + (note.rating || 0), 0) / userNotes.length).toFixed(1) : '0.0'}
                  <Star size={18} className="ml-1 text-yellow-500 fill-yellow-500" />
                </p>
              </div>
              <div className="h-10 w-10 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500">
                <Star size={20} />
              </div>
            </div>
            <div className="mt-4 flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={i < Math.round(userNotes.length ? userNotes.reduce((sum, note) => sum + (note.rating || 0), 0) / userNotes.length : 0) ? 
                    "text-yellow-500 fill-yellow-500" : 
                    "text-gray-300 fill-gray-300"
                  } 
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="my-notes" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="my-notes">My Notes</TabsTrigger>
              <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-notes">
              {userNotes.length > 0 ? (
                <div className="space-y-4">
                  {userNotes.map((note, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-32 bg-gray-200 dark:bg-gray-700 flex-shrink-0">
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
                        
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{note.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {note.description}
                                </p>
                              </div>
                              <Badge variant="outline">{note.subject}</Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Download size={12} className="mr-1" />
                                <span>{note.downloads || 0} downloads</span>
                              </div>
                              <div className="flex items-center">
                                <Eye size={12} className="mr-1" />
                                <span>{note.views || 0} views</span>
                              </div>
                              <div className="flex items-center">
                                <Clock size={12} className="mr-1" />
                                <span>{new Date(note.createdAt || Date.now()).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center text-yellow-500">
                                <Star size={12} className="mr-1 fill-yellow-500" />
                                <span>{note.rating || '0.0'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <Link to={`/notes/${note.id}`}>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </Link>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/20 rounded-lg">
                  <div className="mx-auto w-16 h-16 mb-4 text-muted-foreground">
                    <FilePlus size={64} strokeWidth={1} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No notes uploaded yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Share your knowledge with the community by uploading your first notes.
                  </p>
                  <Button as={Link} to="/upload">
                    Upload Notes
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="bookmarked">
              {bookmarkedNotes.length > 0 ? (
                <div className="space-y-4">
                  {bookmarkedNotes.map((note, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-32 bg-gray-200 dark:bg-gray-700 flex-shrink-0">
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
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{note.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                by {note.author || 'Anonymous'}
                              </p>
                            </div>
                            <Badge variant="outline">{note.subject}</Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {note.description}
                          </p>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center text-yellow-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={12} 
                                  className={i < (note.rating || 0) ? "fill-yellow-500" : ""}
                                />
                              ))}
                              <span className="text-xs ml-1 text-muted-foreground">
                                ({note.numRatings || 0})
                              </span>
                            </div>
                            <Link to={`/notes/${note.id}`}>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/20 rounded-lg">
                  <div className="mx-auto w-16 h-16 mb-4 text-muted-foreground">
                    <Bookmark size={64} strokeWidth={1} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No bookmarked notes yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Browse and bookmark notes that you find helpful to access them later.
                  </p>
                  <Button as={Link} to="/notes">
                    Browse Notes
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <img 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username || 'User'}`} 
                    alt={user?.username} 
                  />
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{user?.username || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email || 'email@example.com'}</p>
                  <Badge variant="outline" className="mt-1">Student</Badge>
                </div>
              </div>
              
              <Button as={Link} to="/settings" variant="outline" className="w-full">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
          
          {/* Recent Activity Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted">
                        {activity.type === 'download' && <Download size={14} />}
                        {activity.type === 'upload' && <FilePlus size={14} />}
                        {activity.type === 'rating' && <Star size={14} />}
                        {activity.type === 'comment' && <Eye size={14} />}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm">
                          {activity.type === 'download' && 'You downloaded'}
                          {activity.type === 'upload' && 'You uploaded'}
                          {activity.type === 'rating' && 'You rated'}
                          {activity.type === 'comment' && 'You commented on'}
                          <span className="font-medium"> {activity.note}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp ? timeAgo(activity.timestamp) : 'Just now'}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                )}
              </ul>
            </CardContent>
            <CardFooter>
              <Link to="/activity" className="text-sm text-primary flex items-center">
                View all activity
                <ChevronRight size={14} className="ml-1" />
              </Link>
            </CardFooter>
          </Card>
          
          {/* Stats Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your Stats</CardTitle>
              <CardDescription>Performance overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Download conversion</span>
                <span className="font-medium">68%</span>
              </div>
              <Progress value={68} className="h-1" />
              
              <div className="flex justify-between text-sm">
                <span>View to rating ratio</span>
                <span className="font-medium">42%</span>
              </div>
              <Progress value={42} className="h-1" />
              
              <div className="flex justify-between text-sm">
                <span>Profile completion</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-1" />
            </CardContent>
            <CardFooter>
              <Link to="/analytics" className="text-sm text-primary flex items-center">
                <BarChart4 size={14} className="mr-1" />
                View detailed analytics
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper function to format relative time
function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return `${interval} year${interval === 1 ? '' : 's'} ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} month${interval === 1 ? '' : 's'} ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} day${interval === 1 ? '' : 's'} ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} hour${interval === 1 ? '' : 's'} ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} minute${interval === 1 ? '' : 's'} ago`;
  }
  
  return `${Math.floor(seconds)} second${seconds === 1 ? '' : 's'} ago`;
}