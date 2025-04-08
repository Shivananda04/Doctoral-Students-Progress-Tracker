import React, { useState } from 'react';
import { Search, Calendar, User, Mail, Phone } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  researchTopic: string;
}

const CoordinatorStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '+1234567890',
      enrollmentDate: '2023-09-01',
      researchTopic: 'Artificial Intelligence in Healthcare',
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      phone: '+9876543210',
      enrollmentDate: '2022-01-15',
      researchTopic: 'Blockchain for Secure Data Sharing',
    },
    {
      id: 3,
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      phone: '+1122334455',
      enrollmentDate: '2021-06-10',
      researchTopic: 'Quantum Computing in Cryptography',
    },
  ]);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.researchTopic.toLowerCase().includes(searchQuery.toLowerCase())
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
              placeholder="Search students by name, email, or research topic..."
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
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{student.name}</h3>
                  <p className="text-sm text-gray-700 mb-1">
                    <Mail size={16} className="mr-2 inline" />
                    <span className="font-medium">Email:</span> {student.email}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <Phone size={16} className="mr-2 inline" />
                    <span className="font-medium">Phone:</span> {student.phone}
                  </p>
                  <div className="flex items-center text-sm text-gray-700 mb-1">
                    <Calendar size={16} className="mr-2" />
                    <span>
                      <span className="font-medium">Enrollment Date:</span>{' '}
                      {new Date(student.enrollmentDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    <User size={16} className="mr-2 inline" />
                    <span className="font-medium">Research Topic:</span> {student.researchTopic}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="portal-card p-8 text-center">
          <div className="flex flex-col items-center">
            <User size={48} className="text-gray-300 mb-4" />
            {searchQuery ? (
              <>
                <h3 className="text-xl font-medium mb-2">No students found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium mb-2">No students yet</h3>
                <p className="text-gray-500 mb-4">No students have been added to the database</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorStudents;