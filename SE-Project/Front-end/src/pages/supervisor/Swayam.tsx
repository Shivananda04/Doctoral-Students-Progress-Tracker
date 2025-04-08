import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Course {
  id: string;
  title: string;
  provider: string;
  duration: number;
  startDate: string;
}

interface Enrollment {
  id: string;
  courseId: string;
  course: Course;
  student: Student;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  enrollmentDate: string;
}

const SwayamSupervisor: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  // Fetch pending enrollments from backend
  useEffect(() => {
    const fetchPendingEnrollments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8080/api/supervisor/enrollments/pending', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setEnrollments(data);
        } else {
          console.error('API did not return an array:', data);
          setEnrollments([]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error('Failed to load enrollments');
        setEnrollments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingEnrollments();
  }, []);

  // Filter enrollments based on search query
  const filteredEnrollments = enrollments.filter(enrollment => {
    const searchLower = searchQuery.toLowerCase();
    const courseTitle = enrollment.course?.title?.toLowerCase() || '';
    const courseProvider = enrollment.course?.provider?.toLowerCase() || '';
    const studentName = enrollment.student?.name?.toLowerCase() || '';

    return (
      courseTitle.includes(searchLower) ||
      courseProvider.includes(searchLower) ||
      studentName.includes(searchLower)
    );
  });

  // Handle approval of enrollment request
  const handleApproval = async (enrollmentId: string) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/supervisor/enrollments/${enrollmentId}/approve`,
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200) {
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      toast.success('Enrollment approved successfully');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        toast.error('Please login again');
      } else if (error.response?.data) {
        toast.error(`Error: ${error.response.data}`);
      } else {
        toast.error('Failed to approve enrollment');
      }
    }
    console.error('Approval error:', error);
  }
};

  // Handle rejection of enrollment request
  const handleRejection = async (enrollmentId: string) => {
    try {
      await axios.post(`http://localhost:8080/api/supervisor/enrollments/${enrollmentId}/reject`);
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      toast.error('Enrollment rejected');
    } catch (error) {
      toast.error('Failed to reject enrollment');
      console.error('Rejection error:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <Search className="w-5 h-5 mr-2 text-gray-500" />
        <input
          type="text"
          placeholder="Search by course, provider or student name..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center text-gray-600">Loading enrollments...</div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="text-center text-gray-500">No pending enrollments found.</div>
      ) : (
        <div className="grid gap-4">
          {filteredEnrollments.map(enrollment => (
            <div key={enrollment.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    {enrollment.course?.title || 'Unknown Course'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Provider: {enrollment.course?.provider || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {enrollment.course?.duration || 0} weeks
                  </p>
                  <p className="text-sm text-gray-600">
                    Start Date: {formatDate(enrollment.course?.startDate || '')}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Student: {enrollment.student?.name || 'Unknown'} ({enrollment.student?.email || 'No Email'})
                  </p>
                  <p className="text-sm text-gray-600">
                    Enrollment Date: {formatDate(enrollment.enrollmentDate)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproval(enrollment.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-green-600"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleRejection(enrollment.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SwayamSupervisor;
