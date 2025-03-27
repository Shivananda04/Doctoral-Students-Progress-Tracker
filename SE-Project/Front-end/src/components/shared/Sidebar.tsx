
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BookOpen, 
  Calendar, 
  BookMarked, 
  Award, 
  Settings, 
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user, logout } = useAuth();

  // Define navigation items based on user role
  const getNavigationItems = () => {
    switch (user?.role) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard size={18} /> },
          { name: 'DC Meetings', path: '/student/meetings', icon: <FileText size={18} /> },
          { name: 'Progress Evaluation', path: '/student/progress', icon: <ChevronRight size={18} /> },
          { name: 'Publications', path: '/student/publications', icon: <BookMarked size={18} /> },
          { name: 'SWAYAM Courses', path: '/student/swayam', icon: <BookOpen size={18} /> },
          { name: 'Exams', path: '/student/exams', icon: <Award size={18} /> },
        ];
      case 'supervisor':
        return [
          { name: 'Dashboard', path: '/supervisor/dashboard', icon: <LayoutDashboard size={18} /> },
          { name: 'My Students', path: '/supervisor/students', icon: <Users size={18} /> },
          { name: 'DC Meetings', path: '/supervisor/meetings', icon: <FileText size={18} /> },
          { name: 'Publications', path: '/supervisor/publications', icon: <BookMarked size={18} /> },
          { name: 'SWAYAM Courses', path: '/supervisor/swayam', icon: <BookOpen size={18} /> },
          { name: 'Exams', path: '/supervisor/exams', icon: <Award size={18} /> },
        ];
      case 'coordinator':
        return [
          { name: 'Dashboard', path: '/coordinator/dashboard', icon: <LayoutDashboard size={18} /> },
          { name: 'Students', path: '/coordinator/students', icon: <Users size={18} /> },
          { name: 'Add Students', path: '/coordinator/add-students', icon: <Users size={18} /> },
          { name: 'SWAYAM Courses', path: '/coordinator/swayam', icon: <BookOpen size={18} /> },
          { name: 'Exam Management', path: '/coordinator/exams', icon: <Award size={18} /> },
          { name: 'Announcements', path: '/coordinator/announcements', icon: <FileText size={18} /> },
        ];
      default:
        return [];
    }
  };

  const navigation = getNavigationItems();

  return (
    <aside className={`portal-sidebar ${!isOpen ? 'transform -translate-x-full' : ''}`}>
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Doctoral Research Portal</h2>
      </div>
      
      <nav className="mt-4 px-2">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `portal-sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </NavLink>
        ))}
        
        <div className="border-t border-border my-4"></div>
        
        <NavLink to="/settings" className="portal-sidebar-item">
          <Settings size={18} />
          <span className="ml-3">Settings</span>
        </NavLink>
        
        <NavLink to="/help" className="portal-sidebar-item">
          <HelpCircle size={18} />
          <span className="ml-3">Help center</span>
        </NavLink>
        
        <button 
          onClick={logout} 
          className="portal-sidebar-item text-red-500 hover:bg-red-50 w-full text-left"
        >
          <LogOut size={18} />
          <span className="ml-3">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
