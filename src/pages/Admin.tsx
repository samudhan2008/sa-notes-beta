import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useNotes } from '@/context/NotesContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, 
  FileText, 
  Flag, 
  BarChart3, 
  Shield, 
  Search,
  CheckCircle,
  XCircle,
  Trash,
  Eye
} from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { notes } = useNotes();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [reportedNotes, setReportedNotes] = useState<Record<string, unknown>[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [noteSearch, setNoteSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterReportType, setFilterReportType] = useState('all');
  
  // Mock statistics
  const statistics = {
    totalUsers: 1254,
    totalNotes: 3687,
    activeUsers: 876,
    totalDownloads: 25432,
    reportsResolved: 98,
    averageRating: 4.3
  };
  
  useEffect(() => {
    // Redirect if not admin
    if (isAuthenticated && !isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Mock data loading
    setUsers([
      { id: 1, username: 'johndoe', email: 'john@example.com', joinDate: '2023-01-15', notesCount: 12, status: 'active' },
      { id: 2, username: 'janedoe', email: 'jane@example.com', joinDate: '2023-02-28', notesCount: 5, status: 'active' },
      { id: 3, username: 'mikebrown', email: 'mike@example.com', joinDate: '2023-04-10', notesCount: 0, status: 'inactive' },
      { id: 4, username: 'sarasmith', email: 'sara@example.com', joinDate: '2023-03-05', notesCount: 8, status: 'active' },
      { id: 5, username: 'alexwilson', email: 'alex@example.com', joinDate: '2023-05-12', notesCount: 3, status: 'suspended' },
    ]);
    
    setReportedNotes([
      { id: 1, title: 'Physics 101 Notes', author: 'johndoe', reportCount: 3, reportType: 'copyright', status: 'pending', reportDate: '2023-06-15' },
      { id: 2, title: 'Calculus Final Exam', author: 'sarasmith', reportCount: 5, reportType: 'inappropriate', status: 'reviewing', reportDate: '2023-06-10' },
      { id: 3, title: 'Biology Cheat Sheet', author: 'alexwilson', reportCount: 8, reportType: 'plagiarism', status: 'resolved', reportDate: '2023-06-05' },
      { id: 4, title: 'CS Algorithms Guide', author: 'mikebrown', reportCount: 1, reportType: 'other', status: 'pending', reportDate: '2023-06-18' },
      { id: 5, title: 'History Study Material', author: 'janedoe', reportCount: 2, reportType: 'copyright', status: 'resolved', reportDate: '2023-06-08' },
    ]);
    
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(userSearch.toLowerCase()) || 
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );
  
  // Filter reported notes based on search term and filters
  const filteredReports = reportedNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(noteSearch.toLowerCase()) || 
                        note.author.toLowerCase().includes(noteSearch.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || note.status === filterStatus;
    const matchesType = filterReportType === 'all' || note.reportType === filterReportType;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const handleApproveReport = (id: number) => {
    // In a real app, this would call an API to update the report status
    setReportedNotes(prev => prev.map(note => 
      note.id === id ? { ...note, status: 'resolved' } : note
    ));
    
    toast({
      title: "Report Resolved",
      description: "The reported note has been handled",
    });
  };
  
  const handleRejectReport = (id: number) => {
    // In a real app, this would call an API to update the report status
    setReportedNotes(prev => prev.map(note => 
      note.id === id ? { ...note, status: 'rejected' } : note
    ));
    
    toast({
      title: "Report Rejected",
      description: "The report has been dismissed",
    });
  };
  
  const handleUserStatus = (id: number, status: string) => {
    // In a real app, this would call an API to update the user status
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, status } : user
    ));
    
    toast({
      title: "User Status Updated",
      description: `User has been marked as ${status}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage users, content, and platform settings
        </p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-3xl font-bold mt-1">
                  {statistics.totalUsers}
                </p>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Users size={20} />
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
                  Total Notes
                </p>
                <p className="text-3xl font-bold mt-1">
                  {statistics.totalNotes}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                <FileText size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="text-green-500 text-xs">+8%</div>
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
                  Total Downloads
                </p>
                <p className="text-3xl font-bold mt-1">
                  {statistics.totalDownloads}
                </p>
              </div>
              <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                <BarChart3 size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="text-green-500 text-xs">+15%</div>
              <p className="text-xs text-muted-foreground">
                From last month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Flag size={16} />
            <span>Reports</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Shield size={16} />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
              <div className="mt-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Join Date</TableHead>
                      <TableHead className="hidden md:table-cell">Notes</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.joinDate}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.notesCount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.status === 'active' ? 'default' :
                                user.status === 'inactive' ? 'secondary' :
                                'destructive'
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye size={14} />
                                <span className="sr-only">View</span>
                              </Button>
                              
                              <Select
                                value={user.status}
                                onValueChange={(value) => handleUserStatus(user.id, value)}
                              >
                                <SelectTrigger className="h-8 w-28">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Activate</SelectItem>
                                  <SelectItem value="inactive">Deactivate</SelectItem>
                                  <SelectItem value="suspended">Suspend</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No users found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reported Content</CardTitle>
              <CardDescription>Review and manage reported notes</CardDescription>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search reports..."
                    className="pl-8"
                    value={noteSearch}
                    onChange={(e) => setNoteSearch(e.target.value)}
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterReportType} onValueChange={setFilterReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="copyright">Copyright</SelectItem>
                    <SelectItem value="inappropriate">Inappropriate</SelectItem>
                    <SelectItem value="plagiarism">Plagiarism</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Note Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="hidden md:table-cell">Report Type</TableHead>
                      <TableHead className="hidden md:table-cell">Reports</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.title}</TableCell>
                          <TableCell>{report.author}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">
                              {report.reportType}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{report.reportCount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                report.status === 'resolved' ? 'default' :
                                report.status === 'rejected' ? 'secondary' :
                                report.status === 'reviewing' ? 'outline' :
                                'destructive'
                              }
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-green-500"
                                onClick={() => handleApproveReport(report.id)}
                                disabled={report.status === 'resolved' || report.status === 'rejected'}
                              >
                                <CheckCircle size={14} />
                                <span className="sr-only">Approve</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-500"
                                onClick={() => handleRejectReport(report.id)}
                                disabled={report.status === 'resolved' || report.status === 'rejected'}
                              >
                                <XCircle size={14} />
                                <span className="sr-only">Reject</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                              >
                                <Eye size={14} />
                                <span className="sr-only">View</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No reports found matching your criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Manage global platform configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="platform-name" className="text-sm font-medium">
                    Platform Name
                  </label>
                  <Input
                    id="platform-name"
                    defaultValue="SA Notes"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="support-email" className="text-sm font-medium">
                    Support Email
                  </label>
                  <Input
                    id="support-email"
                    defaultValue="support@sanotes.com"
                    type="email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="max-upload-size" className="text-sm font-medium">
                  Maximum Upload Size (MB)
                </label>
                <Input
                  id="max-upload-size"
                  defaultValue="20"
                  type="number"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Allowed File Types
                </label>
                <div className="flex flex-wrap gap-2">
                  <Badge>PDF</Badge>
                  <Badge>DOC</Badge>
                  <Badge>DOCX</Badge>
                  <Badge>PPT</Badge>
                  <Badge>PPTX</Badge>
                  <Button variant="outline" size="sm" className="h-6">
                    + Add
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  User Registration
                </label>
                <Select defaultValue="open">
                  <SelectTrigger>
                    <SelectValue placeholder="Registration Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open Registration</SelectItem>
                    <SelectItem value="invite">Invite Only</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Content Moderation
                </label>
                <Select defaultValue="auto">
                  <SelectTrigger>
                    <SelectValue placeholder="Moderation Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre">Pre-moderation (approve before publish)</SelectItem>
                    <SelectItem value="post">Post-moderation (review after publish)</SelectItem>
                    <SelectItem value="auto">Automated moderation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button>
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}