
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="portal-header">
      <button 
        onClick={toggleSidebar} 
        className="p-2 rounded-md hover:bg-gray-100"
      >
        <Menu size={20} />
      </button>
      
      <div className="flex-1 flex justify-center">
        <h1 className="text-xl font-semibold">DOCTORAL RESEARCH PORTAL</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2"
          >
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-portal-blue text-white flex items-center justify-center">
                <User size={16} />
              </div>
            )}
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-border">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowProfileMenu(false)}
              >
                Profile
              </Link>
              
              <Link 
                to="/settings" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowProfileMenu(false)}
              >
                Settings
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
