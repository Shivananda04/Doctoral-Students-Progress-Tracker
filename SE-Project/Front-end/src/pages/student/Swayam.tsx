import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Clock, Calendar, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { isAxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/courses';

interface Course {
  id: string;
  course_name: string;
  Institute: string;
  Duration: string;
  StartDate: string;
}

interface Enrollment {
  id: number;
  courseId: string;
  status: string;
  enrollmentDate: string;
  course: Course;
}

const SwayamCourses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'enrolled'>('available');
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add axios interceptor for handling 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          toast.error('Please login to access this feature');
          // Redirect to login or handle authentication
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [availableRes, enrolledRes] = await Promise.all([
          axios.get<Course[]>(`${API_BASE_URL}/available`, { 
            withCredentials: true 
          }),
          axios.get<Enrollment[]>(`${API_BASE_URL}/enrolled`, { 
            withCredentials: true 
          }).catch(err => {
            console.warn('Failed to fetch enrollments, using empty array', err);
            return { data: [] };
          })
        ]);
        
        setAvailableCourses(availableRes.data);
        setEnrollments(enrolledRes.data || []);
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.message || 'Failed to fetch courses');
        } else {
          toast.error('Failed to fetch courses');
        }
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredAvailableCourses = availableCourses.filter(course => 
    course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.Institute.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnrollRequest = async () => {
    if (!selectedCourse) return;
    
    try {
      const response = await axios.post<Enrollment>(
        `${API_BASE_URL}/${selectedCourse.id}/enroll`,
        {},
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      toast.success(`Enrollment request submitted for ${selectedCourse.course_name}`);
      setEnrollments(prev => [...prev, response.data]);
      setShowModal(false);
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMsg = error.response?.data?.message || 
                       error.response?.data ||
                       'Failed to submit enrollment';
        toast.error(typeof errorMsg === 'string' ? errorMsg : 'Enrollment failed');
      } else {
        
      }
      
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'APPROVED':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Enrolled</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Completed</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Available</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search courses by title or provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAvailableCourses.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{course.course_name}</h3>
                    <p className="text-sm text-gray-500 mb-1">
                      <span className="font-medium">Provider:</span> {course.Institute}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Clock size={16} className="mr-2 text-gray-500" />
                      <span>Duration: {course.Duration} weeks</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2 text-gray-500" />
                      <span>Starts: {new Date(course.StartDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    {getStatusBadge('Available')}
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowModal(true);
                      }}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Request Enrollment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAvailableCourses.length === 0 && (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
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
          {enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{enrollment.course.course_name}</h3>
                      <p className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">Provider:</span> {enrollment.course.Institute}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <Clock size={16} className="mr-2 text-gray-500" />
                        <span>Duration: {enrollment.course.Duration} weeks</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        <span>Started: {new Date(enrollment.course.StartDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div>
                      {getStatusBadge(enrollment.status)}
                      {enrollment.status === 'APPROVED' && (
                        <button className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm">
                          View Course
                        </button>
                      )}
                      {enrollment.status === 'REJECTED' && (
                        <button className="mt-4 text-blue-600 underline text-sm">
                          View Feedback
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="flex flex-col items-center">
                <BookOpen size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">No enrolled courses yet</h3>
                <p className="text-gray-500 mb-4">Browse available courses and request enrollment</p>
                <button 
                  onClick={() => setActiveTab('available')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Browse Courses
                </button>
              </div>
            </div>
          )}
        </>
      )}

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
              <p className="mb-4">You are about to request enrollment for:</p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">{selectedCourse.course_name}</h3>
                <p className="text-sm text-gray-500 mb-2">Provider: {selectedCourse.Institute}</p>
                <p className="text-sm text-gray-500 mb-2">Duration: {selectedCourse.Duration} weeks</p>
                <p className="text-sm text-gray-500">Starts: {new Date(selectedCourse.StartDate).toLocaleDateString()}</p>
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
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