
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'student' | 'supervisor' | 'coordinator';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (role: UserRole) => {
    // Simulating Google login
    // In a real app, this would be integrated with actual Google OAuth
    setIsLoading(true);
    
    // Simulated user data based on role
    const mockUsers = {
      student: {
        id: 'student-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'student',
        profileImage: 'https://i.pravatar.cc/150?u=student',
      },
      supervisor: {
        id: 'supervisor-123',
        name: 'Dr. Jane Smith',
        email: 'jane.smith@example.com',
        role: 'supervisor',
        profileImage: 'https://i.pravatar.cc/150?u=supervisor',
      },
      coordinator: {
        id: 'coordinator-123',
        name: 'Prof. Robert Johnson',
        email: 'robert.johnson@example.com',
        role: 'coordinator',
        profileImage: 'https://i.pravatar.cc/150?u=coordinator',
      },
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const loggedInUser = mockUsers[role] as User;
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
