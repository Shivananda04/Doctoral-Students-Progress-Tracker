
import React, { useState } from 'react';
import { BookOpen, Search, Clock, Calendar, Plus, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface SwayamCourse {
  id: string;
  title: string;
  provider: string;
  duration: number;
  startDate: string;
  status?: 'Available' | 'Enrolled' | 'Completed' | 'Pending' | 'Rejected';
}

const SwayamCourses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'enrolled'>('available');
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<SwayamCourse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const availableCourses: SwayamCourse[] = [
    {
      id: 'CS101',
      title: 'Data Science Basics',
      provider: 'IIT Madras',
      duration: 12,
      startDate: '2023-05-15',
      status: 'Available'
    },
    {
      id: 'CS102',
      title: 'Machine Learning Foundations',
      provider: 'IIT Bombay',
      duration: 8,
      startDate: '2023-06-01',
      status: 'Available'
    },
    {
      id: 'CS103',
      title: 'Deep Learning Applications',
      provider: 'IIT Delhi',
      duration: 10,
      startDate: '2023-05-20',
      status: 'Available'
    },
    {
      id: 'CS104',
      title: 'Natural Language Processing',
      provider: 'IIT Kanpur',
      duration: 8,
      startDate: '2023-06-10',
      status: 'Available'
    },
  ];

  const enrolledCourses: SwayamCourse[] = [
    {
      id: 'CS105',
      title: 'Advanced Algorithms',
      provider: 'IIT Kharagpur',
      duration: 8,
      startDate: '2023-04-10',
      status: 'Enrolled'
    },
    {
      id: 'CS106',
      title: 'Blockchain Technology',
      provider: 'IIT Roorkee',
      duration: 6,
      startDate: '2023-04-05',
      status: 'Pending'
    },
    {
      id: 'CS107',
      title: 'Cloud Computing',
      provider: 'IIT Hyderabad',
      duration: 10,
      startDate: '2023-03-15',
      status: 'Completed'
    },
  ];

  const filteredAvailableCourses = availableCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnrollRequest = () => {
    if (!selectedCourse) return;
    
    // Check if already enrolled
    const alreadyEnrolled = enrolledCourses.some(course => course.id === selectedCourse.id);
    if (alreadyEnrolled) {
      toast.error('You are already enrolled in this course');
      setShowModal(false);
      return;
    }
    
    toast.success(`Enrollment request submitted for ${selectedCourse.title}`);
    setShowModal(false);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Available':
        return <span className="portal-status-draft">Available</span>;
      case 'Enrolled':
        return <span className="portal-status-approved">Enrolled</span>;
      case 'Completed':
        return <span className="portal-status-approved">Completed</span>;
      case 'Pending':
        return <span className="portal-status-pending">Pending</span>;
      case 'Rejected':
        return <span className="portal-status-rejected">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SWAYAM Courses</h1>
        <p className="text-gray-600">Browse and enroll in SWAYAM courses for credits</p>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === 'available'
                ? 'text-portal-blue border-b-2 border-portal-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('available')}
          >
            Available Courses
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === 'enrolled'
                ? 'text-portal-blue border-b-2 border-portal-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('enrolled')}
          >
            My Courses
          </button>
        </div>
      </div>

      {activeTab === 'available' && (
        <>
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="portal-input pl-10"
                placeholder="Search courses by title or provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAvailableCourses.map((course) => (
              <div key={course.id} className="portal-card p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">Provider: {course.provider}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock size={16} className="mr-2" />
                      <span>Duration: {course.duration} weeks</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      <span>Starts: {new Date(course.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    {getStatusBadge(course.status)}
                    
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowModal(true);
                      }}
                      className="mt-4 portal-button-primary text-sm"
                    >
                      Request Enrollment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAvailableCourses.length === 0 && (
            <div className="portal-card p-8 text-center">
              <div className="flex flex-col items-center">
                <BookOpen size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">No courses found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'enrolled' && (
        <>
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="portal-card p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">Provider: {course.provider}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Clock size={16} className="mr-2" />
                        <span>Duration: {course.duration} weeks</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2" />
                        <span>Started: {new Date(course.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div>
                      {getStatusBadge(course.status)}
                      
                      {course.status === 'Enrolled' && (
                        <button className="mt-4 portal-button-secondary text-sm">
                          View Course
                        </button>
                      )}
                      
                      {course.status === 'Rejected' && (
                        <button className="mt-4 text-portal-blue underline text-sm">
                          View Feedback
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="portal-card p-8 text-center">
              <div className="flex flex-col items-center">
                <BookOpen size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">No enrolled courses yet</h3>
                <p className="text-gray-500 mb-4">Browse available courses and request enrollment</p>
                <button 
                  onClick={() => setActiveTab('available')}
                  className="portal-button-primary"
                >
                  Browse Courses
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Enrollment Confirmation Modal */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Confirm Enrollment Request</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="mb-4">
                You are about to request enrollment for:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">{selectedCourse.title}</h3>
                <p className="text-sm text-gray-500 mb-2">Provider: {selectedCourse.provider}</p>
                <p className="text-sm text-gray-500 mb-2">Duration: {selectedCourse.duration} weeks</p>
                <p className="text-sm text-gray-500">Starts: {new Date(selectedCourse.startDate).toLocaleDateString()}</p>
              </div>
              
              <p className="mt-4 text-sm text-gray-500">
                Note: Your enrollment request will be sent to your supervisor for approval.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleEnrollRequest}
                className="portal-button-primary flex items-center"
              >
                <Check size={18} className="mr-2" />
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwayamCourses;
