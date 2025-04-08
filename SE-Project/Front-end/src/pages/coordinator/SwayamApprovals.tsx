import React, { useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import axios from 'axios';

interface SwayamRequest {
  id: number;
  studentName: string;
  courseName: string;
  supervisorApproval: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const CoordinatorSwayamApprovals: React.FC = () => {
  const [requests, setRequests] = useState<SwayamRequest[]>([
    {
      id: 1,
      studentName: 'John Doe',
      courseName: 'Machine Learning',
      supervisorApproval: true,
      status: 'Approved',
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      courseName: 'Data Science',
      supervisorApproval: true,
      status: 'Approved',
    },
  ]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    try {
      const formData = new FormData();
      formData.append('file', file); // 👈 this must match @RequestParam("file") in your controller
  
      const response = await axios.post(
        'http://localhost:8080/api/swayam-courses/u',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      toast.success('Excel sheet uploaded and saved successfully!');
      console.log('Server response:', response.data);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(
        'Failed to process Excel sheet: ' +
          (error.response?.data || error.message)
      );
    }
  };
  
  const approvedRequests = requests.filter(
    (request) => request.supervisorApproval && request.status === 'Approved'
  );

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Swayam Course Approvals</h1>
          <p className="text-gray-600">
            View Swayam course requests approved by supervisors and upload the list of available courses.
          </p>
        </div>
        <div>
          <label htmlFor="upload-courses" className="portal-button-primary flex items-center cursor-pointer">
            <Upload size={16} className="mr-2" />
            Upload Courses
          </label>
          <input
            id="upload-courses"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {approvedRequests.length > 0 ? (
        <div className="portal-card">
          <div className="overflow-x-auto">
            <table className="portal-table">
              <thead className="portal-table-header">
                <tr>
                  <th className="portal-table-header-cell">S.no</th>
                  <th className="portal-table-header-cell">Student Name</th>
                  <th className="portal-table-header-cell">Course Name</th>
                  <th className="portal-table-header-cell">Status</th>
                </tr>
              </thead>
              <tbody className="portal-table-body">
                {approvedRequests.map((request, index) => (
                  <tr key={request.id} className="portal-table-row">
                    <td className="portal-table-cell">{index + 1}</td>
                    <td className="portal-table-cell">{request.studentName}</td>
                    <td className="portal-table-cell">{request.courseName}</td>
                    <td className="portal-table-cell">
                      <span className="portal-status-approved">{request.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="portal-card p-8 text-center">
          <div className="flex flex-col items-center">
            <FileText size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No approved requests available</h3>
            <p className="text-gray-500 mb-4">
              All Swayam course requests have been processed or are awaiting supervisor approval.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorSwayamApprovals;