import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Mail, User } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  roll: string;
  userRole: string;
}

const CoordinatorStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    axios.get<Student[]>('http://localhost:8080/api/studentsyyyz')
      .then((res) => setStudents(res.data))
      .catch((err) => console.error('Failed to fetch students', err));
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.roll.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Students</h1>
          <p className="text-gray-600">View and manage all student details</p>
        </div>
      </div>

      {students.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="portal-input pl-10"
              placeholder="Search by name, email, or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {filteredStudents.length > 0 ? (
        <div className="space-y-6">
          {filteredStudents.map((student) => (
            <div key={student.id} className="portal-card p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{student.name}</h2>
                  <p className="text-gray-600 flex items-center">
                    <Mail className="w-4 h-4 mr-2" /> {student.email}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <User className="w-4 h-4 mr-2" /> Roll No: {student.roll}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No students found.</p>
      )}
    </div>
  );
};

export default CoordinatorStudents;
