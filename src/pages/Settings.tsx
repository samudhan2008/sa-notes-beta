import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Separator,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Avatar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { User, Moon, Sun, Bell, Shield, LogOut } from 'lucide-react';

export default function Settings() {
  const { user, updateUserProfile, changePassword, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  // Profile settings
  const [username, setUsername] = useState(user?.username || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState(user?.profileImage || '');
  
  // Password settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);
  const [downloadNotifications, setDownloadNotifications] = useState(true);
  const [ratingNotifications, setRatingNotifications] = useState(true);
  
  // Privacy settings
  const [publicProfile, setPublicProfile] = useState(true);
  const [showDownloads, setShowDownloads] = useState(true);
  const [showInstitution, setShowInstitution] = useState(true);
  
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setProfilePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateUserProfile({
        username,
        fullName,
        bio,
        institution,
        profileImage
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation must match",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      await changePassword(currentPassword, newPassword);
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was a problem updating your password",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleNotificationUpdate = () => {
    toast({
      title: "Notification Preferences Updated",
      description: "Your notification settings have been saved",
    });
  };
  
  const handlePrivacyUpdate = () => {
    toast({
      title: "Privacy Settings Updated",
      description: "Your privacy settings have been saved",
    });
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    {profilePreview ? (
                      <img 
                        src={profilePreview} 
                        alt={username}
                        className="object-cover"
                      />
                    ) : (
                      <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${username || 'User'}`} 
                        alt={username} 
                      />
                    )}
                  </Avatar>
                  <label 
                    htmlFor="profile-image" 
                    className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 17.2V20.8C3 21.4 3.6 22 4.2 22H7.8C8.1 22 8.4 21.9 8.6 21.7L19.1 11.2L15.8 7.9L5.3 18.4C5.1 18.6 5 18.9 5 19.2V20H5.8C6.1 20 6.4 19.9 6.6 19.7L17.1 9.2L13.8 5.9L3.3 16.4C3.1 16.6 3 16.9 3 17.2ZM21.7 6.3L20.7 5.3C19.9 4.5 18.5 4.5 17.7 5.3L16 7L20 11L21.7 9.3C22.1 8.9 22.1 8.3 21.7 7.9L21.7 6.3Z" fill="currentColor"/>
                    </svg>
                  </label>
                  <input 
                    id="profile-image" 
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden" 
                  />
                </div>
                
                <h2 className="text-xl font-semibold">{user?.fullName || username}</h2>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
                
                <p className="mt-4 text-sm">
                  {bio || 'No bio provided yet. Add something about yourself in the profile settings.'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the appearance</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Moon size={20} />
                <span>Dark Mode</span>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        
        <div className="flex-1">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User size={16} />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Shield size={16} />
                <span className="hidden sm:inline">Password</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell size={16} />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20V15C20 16.1 19.1 17 18 17H6C4.9 17 4 16.1 4 15V6Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 11C9 12.1 9.9 13 11 13H13C14.1 13 15 12.1 15 11C15 9.9 14.1 9 13 9H11C9.9 9 9 9.9 9 11Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 13V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell others a bit about yourself"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Input
                        id="institution"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="School, college or university"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="education">Education Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level of education" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="highschool">High School</SelectItem>
                          <SelectItem value="undergraduate">Undergraduate</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                          <SelectItem value="phd">Ph.D.</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="password" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about your account activity
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Comment Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone comments on your notes
                      </p>
                    </div>
                    <Switch
                      checked={commentNotifications}
                      onCheckedChange={setCommentNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Download Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when your notes are downloaded
                      </p>
                    </div>
                    <Switch
                      checked={downloadNotifications}
                      onCheckedChange={setDownloadNotifications}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rating Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone rates your notes
                      </p>
                    </div>
                    <Switch
                      checked={ratingNotifications}
                      onCheckedChange={setRatingNotifications}
                    />
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleNotificationUpdate}>
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control what information is visible to others
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Public Profile</p>
                      <p className="text-sm text-muted-foreground">
                        Allow others to view your profile
                      </p>
                    </div>
                    <Switch
                      checked={publicProfile}
                      onCheckedChange={setPublicProfile}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Downloads</p>
                      <p className="text-sm text-muted-foreground">
                        Show others how many times your notes have been downloaded
                      </p>
                    </div>
                    <Switch
                      checked={showDownloads}
                      onCheckedChange={setShowDownloads}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Institution</p>
                      <p className="text-sm text-muted-foreground">
                        Display your school or university on your profile
                      </p>
                    </div>
                    <Switch
                      checked={showInstitution}
                      onCheckedChange={setShowInstitution}
                    />
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handlePrivacyUpdate}>
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}