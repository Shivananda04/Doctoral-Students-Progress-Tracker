import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  FileText, 
  BookMarked, 
  Calendar,
  CheckCircle2,
  XCircle,
  LayoutDashboard,
  BookOpen,
  Award,
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SupervisorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data
  const pendingApprovals = [
    { id: 1, type: 'DC Meeting', student: 'John Doe', date: '2023-03-28', status: 'pending' },
    { id: 2, type: 'Publication', student: 'Jane Smith', date: '2023-03-25', status: 'pending' },
    { id: 3, type: 'SWAYAM Course', student: 'Bob Johnson', date: '2023-03-20', status: 'pending' },
  ];

  // Navigation options for quick access
  const navigationOptions = [
    { path: '/supervisor/students', label: 'Students', icon: <Users size={16} /> },
    { path: '/supervisor/meetings', label: 'DC Meetings', icon: <FileText size={16} /> },
    { path: '/supervisor/publications', label: 'Publications', icon: <BookMarked size={16} /> },
    { path: '/supervisor/swayam', label: 'SWAYAM', icon: <BookOpen size={16} /> },
    { path: '/supervisor/exams', label: 'Exams', icon: <Award size={16} /> },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Supervisor Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Quick Navigation Buttons */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Navigation</h2>
        <div className="flex flex-wrap gap-3">
          {navigationOptions.map((option) => (
            <Button
              key={option.path}
              variant="outline"
              onClick={() => navigate(option.path)}
              className="flex items-center gap-2"
            >
              {option.icon}
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="portal-card p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <Users size={20} className="text-portal-blue mr-2" />
            <h3 className="font-medium">Students</h3>
          </div>
          <div className="text-3xl font-bold mt-2">3</div>
          <p className="text-sm text-gray-500 mt-1">Under your supervision</p>
        </div>
        
        <div className="portal-card p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <FileText size={20} className="text-portal-blue mr-2" />
            <h3 className="font-medium">Pending Reviews</h3>
          </div>
          <div className="text-3xl font-bold mt-2">5</div>
          <p className="text-sm text-gray-500 mt-1">Awaiting your approval</p>
        </div>
        
        <div className="portal-card p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <BookMarked size={20} className="text-portal-blue mr-2" />
            <h3 className="font-medium">Publications</h3>
          </div>
          <div className="text-3xl font-bold mt-2">12</div>
          <p className="text-sm text-gray-500 mt-1">From your students this year</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Pending Approvals */}
        <div className="portal-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pending Approvals</h2>
            <Link to="/supervisor/approvals" className="text-sm text-portal-blue hover:underline">View all</Link>
          </div>
          
          <div className="space-y-4">
            {pendingApprovals.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.type}</p>
                    <p className="text-sm text-gray-500">Student: {item.student}</p>
                    <p className="text-sm text-gray-500">Submitted: {item.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200">
                      <CheckCircle2 size={16} />
                    </button>
                    <button className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200">
                      <XCircle size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="portal-card p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">March 2023</h3>
              <div className="flex space-x-2">
                <button className="p-1 rounded hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button className="p-1 rounded hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              <div className="text-gray-500">Su</div>
              <div className="text-gray-500">Mo</div>
              <div className="text-gray-500">Tu</div>
              <div className="text-gray-500">We</div>
              <div className="text-gray-500">Th</div>
              <div className="text-gray-500">Fr</div>
              <div className="text-gray-500">Sa</div>
              {Array.from({ length: 31 }, (_, i) => (
                <div 
                  key={i} 
                  className={`Calendar-day ${i + 1 === 15 ? 'active' : ''} ${i + 1 === 10 || i + 1 === 20 ? 'has-event' : ''}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center p-2 hover:bg-gray-50 rounded">
              <Calendar size={16} className="text-portal-blue mr-2" />
              <div>
                <p className="text-sm font-medium">DC Meeting - John Doe</p>
                <p className="text-xs text-gray-500">April 10, 2023</p>
              </div>
            </div>
            <div className="flex items-center p-2 hover:bg-gray-50 rounded">
              <Calendar size={16} className="text-portal-blue mr-2" />
              <div>
                <p className="text-sm font-medium">Comprehensive Exam Committee</p>
                <p className="text-xs text-gray-500">April 15, 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;