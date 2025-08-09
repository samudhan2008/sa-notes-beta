import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Input
} from "@/components/ui";
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, Search, Menu, X } from 'lucide-react';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  return (
    <Navbar className="shadow-sm border-b" maxWidth="full">
      <NavbarContent className="flex">
        <NavbarBrand as={Link} to="/" className="mr-4">
          <div className="font-bold text-xl flex items-center space-x-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              <path d="m15 5 4 4"></path>
            </svg>
            <span>SA Notes</span>
          </div>
        </NavbarBrand>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <NavbarItem>
            <Link to="/notes" className="px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
              Browse Notes
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link to="/upload" className="px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
              Upload
            </Link>
          </NavbarItem>
          {isAuthenticated && user?.role === 'admin' && (
            <NavbarItem>
              <Link to="/admin" className="px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                Admin
              </Link>
            </NavbarItem>
          )}
        </div>
      </NavbarContent>

      {/* Search Bar */}
      <NavbarContent className="hidden sm:flex flex-1 justify-center">
        <form onSubmit={handleSearch} className="w-full max-w-md">
          <Input
            classNames={{
              base: "max-w-full h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal bg-default-100 border-1"
            }}
            placeholder="Search for notes..."
            size="sm"
            startContent={<Search size={16} />}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </NavbarContent>

      {/* Desktop Right Navigation */}
      <NavbarContent justify="end" className="hidden md:flex">
        <NavbarItem className="flex items-center">
          <Button 
            isIconOnly 
            variant="light" 
            aria-label="Toggle theme" 
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </NavbarItem>

        {isAuthenticated ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={user?.username || "User"}
                size="sm"
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username || "User"}`}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" textValue="Profile">
                <Link to="/dashboard" className="w-full">Dashboard</Link>
              </DropdownItem>
              <DropdownItem key="settings" textValue="Settings">
                <Link to="/settings" className="w-full">Settings</Link>
              </DropdownItem>
              <DropdownItem key="logout" textValue="Logout" color="danger" className="text-danger" onPress={logout}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div className="flex gap-2">
            <NavbarItem>
              <Button as={Link} to="/login" color="primary" variant="flat">
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} to="/register" color="primary">
                Sign Up
              </Button>
            </NavbarItem>
          </div>
        )}
      </NavbarContent>

      {/* Mobile Menu Toggle */}
      <div className="flex md:hidden justify-end">
        <Button isIconOnly variant="light" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-white dark:bg-gray-900 flex flex-col md:hidden p-4">
          <form onSubmit={handleSearch} className="w-full mb-4">
            <Input
              classNames={{
                base: "max-w-full h-10",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full font-normal bg-default-100 border-1"
              }}
              placeholder="Search for notes..."
              size="sm"
              startContent={<Search size={16} />}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          <div className="flex flex-col space-y-2">
            <Link 
              to="/notes" 
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Notes
            </Link>
            <Link 
              to="/upload" 
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Upload
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between p-2">
              <span>Theme</span>
              <Button 
                isIconOnly 
                variant="light" 
                aria-label="Toggle theme" 
                onClick={toggleTheme}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </Button>
            </div>
            
            {isAuthenticated ? (
              <Button 
                color="danger" 
                variant="flat" 
                className="w-full mt-2"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
              >
                Logout
              </Button>
            ) : (
              <div className="flex flex-col space-y-2 mt-2">
                <Button 
                  as={Link} 
                  to="/login" 
                  color="primary" 
                  variant="flat" 
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  color="primary" 
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </Navbar>
  );
}