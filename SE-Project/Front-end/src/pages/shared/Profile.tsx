
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Pencil, Save, X, User, Mail, Calendar, BookOpen, Award, FileText, Users } from 'lucide-react';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock student data
  const [studentData, setStudentData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'CSED',
    degree: 'PhD',
    dateOfJoining: '2022-08-15',
    admissionScheme: 'JRF',
    researchArea: 'Machine Learning and Natural Language Processing',
    contact: '+91 9876543210',
  });
  
  // Mock DC panel data
  const dcMembers = [
    { role: 'DC Chair', name: 'Prof. Anurag Verma', department: 'CSED' },
    { role: 'Guide', name: 'Dr. Jane Smith', department: 'CSED' },
    { role: 'Member', name: 'Dr. Robert Johnson', department: 'CSED' },
    { role: 'Member', name: 'Prof. Emily Chen', department: 'Electronics Engineering' },
  ];
  
  // Mock coursework data
  const courseworkData = [
    { code: 'CS601', title: 'Advanced Algorithms', credits: 4, grade: 'A' },
    { code: 'CS602', title: 'Machine Learning', credits: 4, grade: 'A-' },
    { code: 'CS603', title: 'Natural Language Processing', credits: 3, grade: 'B+' },
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile</h1>
        {user?.role === 'student' && (
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className={`portal-button-${isEditing ? 'secondary' : 'primary'} flex items-center`}
          >
            {isEditing ? (
              <>
                <X size={16} className="mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Pencil size={16} className="mr-2" />
                Edit Profile
              </>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Image and Basic Info */}
        <div className="portal-card p-6 col-span-1 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-portal-lightBlue flex items-center justify-center mb-4">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={48} className="text-portal-blue" />
            )}
          </div>
          
          <h2 className="text-xl font-semibold">{studentData.name}</h2>
          <p className="text-gray-500">{studentData.department}</p>
          <p className="text-gray-500">{studentData.degree} Scholar</p>
          
          <div className="mt-4 w-full">
            <div className="flex items-center py-2">
              <Mail size={16} className="text-gray-500 mr-2" />
              <span className="text-sm">{studentData.email}</span>
            </div>
            <div className="flex items-center py-2">
              <Calendar size={16} className="text-gray-500 mr-2" />
              <span className="text-sm">Joined: {new Date(studentData.dateOfJoining).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center py-2">
              <Award size={16} className="text-gray-500 mr-2" />
              <span className="text-sm">Scheme: {studentData.admissionScheme}</span>
            </div>
          </div>
        </div>

        {/* Student Details */}
        <div className="portal-card p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">Student Details</h2>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Research Area
                </label>
                <input
                  type="text"
                  className="portal-input"
                  value={studentData.researchArea}
                  onChange={(e) => setStudentData({...studentData, researchArea: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  className="portal-input"
                  value={studentData.contact}
                  onChange={(e) => setStudentData({...studentData, contact: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button 
                  onClick={cancelEditing}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="portal-button-primary flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Department</h3>
                <p>{studentData.department}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Degree</h3>
                <p>{studentData.degree}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date of Joining</h3>
                <p>{new Date(studentData.dateOfJoining).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Admission Scheme</h3>
                <p>{studentData.admissionScheme}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Research Area</h3>
                <p>{studentData.researchArea}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                <p>{studentData.contact}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* DC Members */}
      <div className="portal-card p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">DC Panel Members</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead className="portal-table-header">
              <tr>
                <th className="portal-table-header-cell">Role</th>
                <th className="portal-table-header-cell">Name</th>
                <th className="portal-table-header-cell">Department</th>
              </tr>
            </thead>
            <tbody className="portal-table-body">
              {dcMembers.map((member, index) => (
                <tr key={index} className="portal-table-row">
                  <td className="portal-table-cell">{member.role}</td>
                  <td className="portal-table-cell font-medium">{member.name}</td>
                  <td className="portal-table-cell">{member.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Coursework */}
      <div className="portal-card p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Coursework</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead className="portal-table-header">
              <tr>
                <th className="portal-table-header-cell">Course Code</th>
                <th className="portal-table-header-cell">Course Title</th>
                <th className="portal-table-header-cell">Credits</th>
                <th className="portal-table-header-cell">Grade</th>
              </tr>
            </thead>
            <tbody className="portal-table-body">
              {courseworkData.map((course, index) => (
                <tr key={index} className="portal-table-row">
                  <td className="portal-table-cell">{course.code}</td>
                  <td className="portal-table-cell font-medium">{course.title}</td>
                  <td className="portal-table-cell">{course.credits}</td>
                  <td className="portal-table-cell">{course.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium">Total Credits: 11</p>
          <p className="text-sm font-medium">CGPA: 3.8/4.0</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
