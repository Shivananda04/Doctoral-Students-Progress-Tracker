import React from 'react';
import { Clock, Calendar, Check, X } from 'lucide-react';

interface SwayamCourse {
  id: string;
  title: string;
  provider: string;
  duration: number;
  startDate: string;
  status?: 'Available' | 'Enrolled' | 'Completed' | 'Pending' | 'Rejected';
}

interface CourseCardProps {
  course: SwayamCourse;
  children?: React.ReactNode;
  onApprove?: () => void;
  onReject?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onApprove, onReject }) => {
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
    <div className="portal-card p-6 hover:shadow-md transition-shadow">
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
          {course.status === 'Pending' && (
            <div className="mt-4 flex space-x-2">
              <button onClick={onApprove} className="portal-button-primary text-sm">
                <Check size={18} className="mr-1" /> Approve
              </button>
              <button onClick={onReject} className="portal-button-secondary text-sm">
                <X size={18} className="mr-1" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;