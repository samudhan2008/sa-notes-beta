import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('saNotesUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('saNotesUser');
      }
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, we would make an API call to validate credentials
    try {
      // For demo purposes - check if it's the admin
      if (email === 'admin@sanotes' && password === 'admin@123') {
        const adminUser = {
          id: 'admin-123',
          username: 'admin',
          email: 'admin@sanotes',
          isVerified: true,
          role: 'admin' as const
        };
        setUser(adminUser);
        setIsAuthenticated(true);
        localStorage.setItem('saNotesUser', JSON.stringify(adminUser));
        return true;
      }

      // For demo purposes - simulate login for regular users
      // In a real app, we would validate credentials against a backend
      const mockUsers = JSON.parse(localStorage.getItem('saNotesUsers') || '[]');
      const foundUser = mockUsers.find((u: Record<string, unknown>) => u.email === email && u.password === password);
      
      if (foundUser) {
        // Don't store password in state or localStorage
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('saNotesUser', JSON.stringify(userWithoutPassword));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Register function
  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      // For demo purposes - store user in localStorage
      // In a real app, we would send this data to a backend API
      const mockUsers = JSON.parse(localStorage.getItem('saNotesUsers') || '[]');
      
      // Check if email already exists
      if (mockUsers.some((u: Record<string, unknown>) => u.email === email)) {
        return false;
      }
      
      const newUser = {
        id: `user-${Date.now()}`,
        username,
        email,
        password, // Note: In a real app, NEVER store plain text passwords
        isVerified: false, // Would require email verification in a real app
        role: 'user' as const,
        createdAt: new Date().toISOString()
      };
      
      mockUsers.push(newUser);
      localStorage.setItem('saNotesUsers', JSON.stringify(mockUsers));
      
      // Auto-login the user (in a real app, we might require email verification first)
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('saNotesUser', JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('saNotesUser');
  };

  // Email verification function - simulated for the demo
  const verifyEmail = async (token: string): Promise<boolean> => {
    // In a real app, we would verify this token with a backend API
    try {
      if (user) {
        const updatedUser = { ...user, isVerified: true };
        setUser(updatedUser);
        localStorage.setItem('saNotesUser', JSON.stringify(updatedUser));
        
        // Also update in the users array
        const mockUsers = JSON.parse(localStorage.getItem('saNotesUsers') || '[]');
        const updatedUsers = mockUsers.map((u: Record<string, unknown>) => 
          u.id === user.id ? { ...u, isVerified: true } : u
        );
        localStorage.setItem('saNotesUsers', JSON.stringify(updatedUsers));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Email verification error:', error);
      return false;
    }
  };

  // Password reset function - simulated for the demo
  const resetPassword = async (email: string): Promise<boolean> => {
    // In a real app, we would send a password reset email
    try {
      const mockUsers = JSON.parse(localStorage.getItem('saNotesUsers') || '[]');
      const userExists = mockUsers.some((u: Record<string, unknown>) => u.email === email);
      return userExists;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      verifyEmail,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}