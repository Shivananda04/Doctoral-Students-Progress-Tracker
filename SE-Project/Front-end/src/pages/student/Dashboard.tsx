import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Bell, 
  BookOpen,
  File,
  BookMarked
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data
  const notifications = [
    { id: 1, text: 'Your DC meeting minutes were approved', time: '2 hours ago' },
    { id: 2, text: 'New SWAYAM course available: Machine Learning', time: '1 day ago' },
    { id: 3, text: 'Comprehensive exam scheduled on April 15, 2023', time: '3 days ago' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'DC Meeting', date: '2023-04-10' },
    { id: 2, title: 'Comprehensive Exam', date: '2023-04-15' },
    { id: 3, title: 'Paper Submission Deadline', date: '2023-04-20' },
  ];

  // Navigation options for quick access
  const navigationOptions = [
    { path: '/student/meetings', label: 'DC Meetings', icon: <File size={16} /> },
    { path: '/student/publications', label: 'Publications', icon: <BookMarked size={16} /> },
    { path: '/student/swayam', label: 'SWAYAM Courses', icon: <BookOpen size={16} /> },
    { path: '/student/exams', label: 'Exams', icon: <Calendar size={16} /> },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Your doctoral journey at a glance</p>
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
        {/* Quick Links */}
        <div className="portal-card p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Link to="/student/meetings" className="flex flex-col items-center p-4 bg-portal-lightBlue rounded-lg hover:bg-blue-100 transition-colors">
              <File size={24} className="text-portal-blue mb-2" />
              <span className="text-sm font-medium">DC Meetings</span>
            </Link>
            <Link to="/student/publications" className="flex flex-col items-center p-4 bg-portal-lightBlue rounded-lg hover:bg-blue-100 transition-colors">
              <BookMarked size={24} className="text-portal-blue mb-2" />
              <span className="text-sm font-medium">Publications</span>
            </Link>
            <Link to="/student/swayam" className="flex flex-col items-center p-4 bg-portal-lightBlue rounded-lg hover:bg-blue-100 transition-colors">
              <BookOpen size={24} className="text-portal-blue mb-2" />
              <span className="text-sm font-medium">SWAYAM Courses</span>
            </Link>
            <Link to="/student/exams" className="flex flex-col items-center p-4 bg-portal-lightBlue rounded-lg hover:bg-blue-100 transition-colors">
              <Calendar size={24} className="text-portal-blue mb-2" />
              <span className="text-sm font-medium">Exams</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center p-4 bg-portal-lightBlue rounded-lg hover:bg-blue-100 transition-colors">
              <BookOpen size={24} className="text-portal-blue mb-2" />
              <span className="text-sm font-medium">My Courses</span>
            </Link>
          </div>
        </div>

        {/* Calendar */}
        <div className="portal-card p-6">
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
                  className={`calendar-day ${i + 1 === 15 ? 'active' : ''} ${i + 1 === 10 || i + 1 === 20 ? 'has-event' : ''}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-medium text-sm mb-2">Upcoming Events</h3>
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <div className="w-2 h-2 bg-portal-blue rounded-full mr-2"></div>
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="portal-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <Link to="/notifications" className="text-sm text-portal-blue hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start p-3 border-b border-gray-100 last:border-0">
                <div className="bg-portal-lightBlue p-2 rounded-full mr-3">
                  <Bell size={16} className="text-portal-blue" />
                </div>
                <div>
                  <p className="text-sm">{notification.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="portal-card p-6">
          <h2 className="text-xl font-semibold mb-4">Progress Summary</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Coursework</span>
                <span className="text-sm text-gray-500">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-portal-blue rounded-full h-2" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Publications</span>
                <span className="text-sm text-gray-500">50%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-portal-blue rounded-full h-2" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">DC Meetings</span>
                <span className="text-sm text-gray-500">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-portal-blue rounded-full h-2" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Comprehensive Exam</span>
                <span className="text-sm text-gray-500">0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-portal-blue rounded-full h-2" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;