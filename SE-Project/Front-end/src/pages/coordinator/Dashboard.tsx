
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  BookOpen, 
  Award, 
  Calendar,
  BarChart,
  FileText,
  Bell,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CoordinatorDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data
  const announcements = [
    { id: 1, title: 'Comprehensive Exam Schedule Released', date: '2023-03-25' },
    { id: 2, title: 'New SWAYAM Course Registration Open', date: '2023-03-20' },
    { id: 3, title: 'Doctoral Seminar Series', date: '2023-03-15' },
  ];

  const examStats = [
    { name: 'Registered', count: 25 },
    { name: 'Appeared', count: 22 },
    { name: 'Passed', count: 18 },
    { name: 'Failed', count: 4 },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Coordinator Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="portal-card p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <Users size={20} className="text-portal-blue mr-2" />
            <h3 className="font-medium">Total Students</h3>
          </div>
          <div className="text-3xl font-bold mt-2">42</div>
          <p className="text-sm text-gray-500 mt-1">Active Ph.D. students</p>
        </div>
        
        <div className="portal-card p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <Award size={20} className="text-portal-blue mr-2" />
            <h3 className="font-medium">Comprehensive Exams</h3>
          </div>
          <div className="text-3xl font-bold mt-2">12</div>
          <p className="text-sm text-gray-500 mt-1">Scheduled this semester</p>
        </div>
        
        <div className="portal-card p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <BookOpen size={20} className="text-portal-blue mr-2" />
            <h3 className="font-medium">SWAYAM Courses</h3>
          </div>
          <div className="text-3xl font-bold mt-2">15</div>
          <p className="text-sm text-gray-500 mt-1">Available for registration</p>
        </div>
        
        <div className="portal-card p-6 flex flex-col">
          <div className="flex items-center mb-2">
            <Bell size={20} className="text-portal-blue mr-2" />
            <h3 className="font-medium">Announcements</h3>
          </div>
          <div className="text-3xl font-bold mt-2">3</div>
          <p className="text-sm text-gray-500 mt-1">Published this month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="portal-card p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/coordinator/add-students" className="flex flex-col items-center p-4 bg-portal-lightBlue rounded-lg hover:bg-blue-100 transition-colors">
              <Users size={24} className="text-portal-blue mb-2" />
              <span className="text-sm font-medium">Add Students</span>
            </Link>
            <Link to="/coordinator/announcements/create" className="flex flex-col items-center p-4 bg-portal-lightBlue rounded-lg hover:bg-blue-100 transition-colors">
              <Bell size={24} className="text-portal-blue mb-2" />
              <span className="text-sm font-medium">Create Announcement</span>
            </Link>
            <Link to="/coordinator/exams/schedule" className="flex flex-col items-center p-4 bg-portal-lightBlue rounded-lg hover:bg-blue-100 transition-colors">
              <Calendar size={24} className="text-portal-blue mb-2" />
              <span className="text-sm font-medium">Schedule Exam</span>
            </Link>
            <Link to="/coordinator/swayam/upload" className="flex flex-col items-center p-4 bg-portal-lightBlue rounded-lg hover:bg-blue-100 transition-colors">
              <BookOpen size={24} className="text-portal-blue mb-2" />
              <span className="text-sm font-medium">Upload SWAYAM Courses</span>
            </Link>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="portal-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Announcements</h2>
            <Link to="/coordinator/announcements" className="text-sm text-portal-blue hover:underline">View all</Link>
          </div>
          
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start">
                  <Bell size={18} className="text-portal-blue mt-1 mr-3" />
                  <div>
                    <p className="font-medium">{announcement.title}</p>
                    <p className="text-sm text-gray-500">Published: {announcement.date}</p>
                  </div>
                </div>
              </div>
            ))}
            
            <Link 
              to="/coordinator/announcements/create" 
              className="flex items-center justify-center p-3 border border-dashed border-gray-300 rounded-lg hover:border-portal-blue text-gray-500 hover:text-portal-blue transition-colors"
            >
              <Plus size={18} className="mr-2" />
              <span>Create New Announcement</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Comprehensive Exam Statistics */}
        <div className="portal-card p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Exam Statistics</h2>
          <div className="space-y-4">
            {examStats.map((stat, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{stat.name}</span>
                  <span className="text-sm text-gray-500">{stat.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-portal-blue rounded-full h-2" 
                    style={{ width: `${(stat.count / 25) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Calendar */}
        <div className="portal-card p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Calendar</h2>
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
                  className={`calendar-day ${i + 1 === 15 ? 'active' : ''} ${[10, 12, 18, 20, 25].includes(i + 1) ? 'has-event' : ''}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="portal-card p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-portal-lightBlue p-2 rounded-full mr-3">
                <FileText size={16} className="text-portal-blue" />
              </div>
              <div>
                <p className="text-sm font-medium">Comprehensive Exam Results Published</p>
                <p className="text-xs text-gray-500 mt-1">Today, 10:30 AM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-portal-lightBlue p-2 rounded-full mr-3">
                <Users size={16} className="text-portal-blue" />
              </div>
              <div>
                <p className="text-sm font-medium">New Student Data Uploaded</p>
                <p className="text-xs text-gray-500 mt-1">Yesterday, 2:15 PM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-portal-lightBlue p-2 rounded-full mr-3">
                <BookOpen size={16} className="text-portal-blue" />
              </div>
              <div>
                <p className="text-sm font-medium">SWAYAM Course List Updated</p>
                <p className="text-xs text-gray-500 mt-1">Mar 24, 2023, 9:00 AM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-portal-lightBlue p-2 rounded-full mr-3">
                <Bell size={16} className="text-portal-blue" />
              </div>
              <div>
                <p className="text-sm font-medium">New Announcement Published</p>
                <p className="text-xs text-gray-500 mt-1">Mar 20, 2023, 11:45 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
