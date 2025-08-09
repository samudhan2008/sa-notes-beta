import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Label,
  Badge
} from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useNotes } from '@/context/NotesContext';
import { useToast } from '@/components/ui/use-toast';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';

// Subject categories for the dropdown
const SUBJECTS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'History',
  'Literature',
  'Engineering',
  'Business',
  'Psychology',
  'Sociology',
  'Art',
  'Music',
  'Languages',
  'Other'
];

export default function UploadPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { uploadNote } = useNotes();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [course, setCourse] = useState('');
  const [institution, setInstitution] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    subject?: string;
    file?: string;
  }>({});
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login', { state: { from: '/upload' } });
    return null;
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is a PDF
      if (selectedFile.type !== 'application/pdf') {
        setErrors({ ...errors, file: 'Only PDF files are supported' });
        return;
      }
      
      // Check file size (max 20MB)
      if (selectedFile.size > 20 * 1024 * 1024) {
        setErrors({ ...errors, file: 'File size exceeds 20MB limit' });
        return;
      }
      
      setFile(selectedFile);
      setErrors({ ...errors, file: undefined });
    }
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is an image
      if (!selectedFile.type.startsWith('image/')) {
        toast({
          title: "Invalid file",
          description: "Please select an image file for the cover image",
          variant: "destructive",
        });
        return;
      }
      
      setCoverImage(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setCoverImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      
      const trimmedTag = currentTag.trim();
      
      if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
        setTags([...tags, trimmedTag]);
        setCurrentTag('');
      }
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const validateForm = () => {
    const newErrors: {
      title?: string;
      description?: string;
      subject?: string;
      file?: string;
    } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }
    
    if (!subject) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!file) {
      newErrors.file = 'Please upload a PDF file';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real implementation, this would upload to a backend server
      const noteData = {
        title,
        description,
        subject,
        course: course || undefined,
        institution: institution || undefined,
        year: year || undefined,
        tags: tags.length ? tags : undefined,
        file,
        coverImage: coverImage || undefined,
        author: user?.username,
        authorId: user?.id,
        createdAt: new Date().toISOString(),
      };
      
      await uploadNote(noteData);
      
      toast({
        title: "Success!",
        description: "Your note has been uploaded successfully",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your note. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Notes</h1>
        <p className="text-muted-foreground mt-1">
          Share your knowledge with the community
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* PDF Upload Card */}
          <Card className={`md:col-span-1 ${errors.file ? 'border-red-500' : ''}`}>
            <CardHeader>
              <CardTitle className="text-lg">Upload PDF</CardTitle>
              <CardDescription>Select a PDF file to upload</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
              {file ? (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                    <FileText size={32} className="text-primary" />
                  </div>
                  <p className="font-medium mb-1 break-all">{file.name}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500"
                    onClick={() => setFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="w-full cursor-pointer">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm font-medium mb-1">
                      Drag and drop your PDF here
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Maximum file size: 20MB
                    </p>
                    <Button type="button" variant="outline" size="sm">
                      Browse Files
                    </Button>
                    <Input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </label>
              )}
              {errors.file && (
                <div className="text-red-500 text-sm flex items-center mt-2">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.file}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Cover Image Upload */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Cover Image</CardTitle>
              <CardDescription>Add a cover image for your notes (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              {coverImagePreview ? (
                <div className="relative">
                  <img 
                    src={coverImagePreview} 
                    alt="Cover preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setCoverImage(null);
                      setCoverImagePreview(null);
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors h-48 flex flex-col items-center justify-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-sm font-medium mb-1">
                      Click to upload a cover image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 1200 x 800 pixels
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverImageChange}
                  />
                </label>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Note Details Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Note Details</CardTitle>
            <CardDescription>Enter information about your notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center">
                  Title <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Calculus"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="flex items-center">
                  Subject <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger 
                    id="subject" 
                    className={errors.subject ? 'border-red-500' : ''}
                  >
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
                {errors.subject && (
                  <p className="text-red-500 text-sm">{errors.subject}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center">
                Description <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Provide a brief summary of what these notes cover..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description ? (
                <p className="text-red-500 text-sm">{errors.description}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  A good description helps others find your notes (min. 20 characters)
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="course">
                  Course/Class <span className="text-muted-foreground text-xs ml-1">(optional)</span>
                </Label>
                <Input
                  id="course"
                  placeholder="e.g., MATH 101"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="institution">
                  Institution <span className="text-muted-foreground text-xs ml-1">(optional)</span>
                </Label>
                <Input
                  id="institution"
                  placeholder="e.g., Harvard University"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">
                  Year <span className="text-muted-foreground text-xs ml-1">(optional)</span>
                </Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max="2099"
                  step="1"
                  placeholder={new Date().getFullYear().toString()}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">
                Tags <span className="text-muted-foreground text-xs ml-1">(optional)</span>
              </Label>
              <div className={`flex flex-wrap gap-2 p-2 border rounded-md mb-2 min-h-[42px] ${tags.length > 0 ? 'pb-0' : ''}`}>
                {tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="flex items-center gap-1 mb-2"
                  >
                    {tag}
                    <X 
                      size={14} 
                      className="cursor-pointer opacity-70 hover:opacity-100" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
                <Input
                  id="tags"
                  placeholder={tags.length ? '' : "Type tags and press Enter..."}
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  className={`border-0 p-0 h-8 mb-2 min-w-[120px] ${tags.length > 0 ? 'flex-grow' : 'w-full'}`}
                  disabled={tags.length >= 10}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Add up to 10 tags separated by Enter or comma (,)
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Terms and Submit */}
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-6">
              By uploading, you confirm that these notes do not violate any copyright laws and adhere to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a>.
            </div>
            
            <div className="flex flex-col md:flex-row justify-end gap-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload Notes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}