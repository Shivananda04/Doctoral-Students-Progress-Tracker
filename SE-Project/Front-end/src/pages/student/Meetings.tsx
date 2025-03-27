
import React, { useState } from 'react';
import { FileText, Upload, Calendar, Plus, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface DCMeeting {
  id: number;
  date: string;
  summary: string;
  file: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Resubmit';
  comments?: string;
}

const DCMeetings: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [meetings, setMeetings] = useState<DCMeeting[]>([
    {
      id: 1,
      date: '2023-01-21',
      summary: 'Initial research proposal discussion',
      file: 'DC_meeting_1_21Jan2023.pdf',
      status: 'Approved',
    },
    {
      id: 2,
      date: '2023-03-15',
      summary: 'Literature review progress and methodology discussion',
      file: 'DC_meeting_2_15Mar2023.pdf',
      status: 'Submitted',
    },
    {
      id: 3,
      date: '2023-04-05',
      summary: 'Research progress and preliminary results',
      file: 'DC_meeting_3_05Apr2023.pdf',
      status: 'Draft',
    },
  ]);

  const [newMeeting, setNewMeeting] = useState({
    date: '',
    summary: '',
    file: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewMeeting({ ...newMeeting, file: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!newMeeting.date || !newMeeting.summary || !newMeeting.file) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // File type validation
    const fileType = newMeeting.file.type;
    if (fileType !== 'application/pdf' && !fileType.includes('word')) {
      toast.error('Please upload a PDF or DOCX file');
      return;
    }
    
    // Add new meeting
    const newMeetingObj: DCMeeting = {
      id: meetings.length + 1,
      date: newMeeting.date,
      summary: newMeeting.summary,
      file: newMeeting.file.name,
      status: 'Submitted',
    };
    
    setMeetings([...meetings, newMeetingObj]);
    setNewMeeting({ date: '', summary: '', file: null });
    setShowModal(false);
    
    toast.success('Meeting minutes submitted successfully');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <span className="portal-status-draft">Draft</span>;
      case 'Submitted':
        return <span className="portal-status-pending">Submitted</span>;
      case 'Approved':
        return <span className="portal-status-approved">Approved</span>;
      case 'Rejected':
        return <span className="portal-status-rejected">Rejected</span>;
      case 'Resubmit':
        return <span className="portal-status-rejected">Resubmit</span>;
      default:
        return <span className="portal-status-draft">Draft</span>;
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">DC Meetings</h1>
          <p className="text-gray-600">Upload and manage your doctoral committee meeting minutes</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="portal-button-primary flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Log New Meeting
        </button>
      </div>

      {meetings.length > 0 ? (
        <div className="portal-card">
          <div className="overflow-x-auto">
            <table className="portal-table">
              <thead className="portal-table-header">
                <tr>
                  <th className="portal-table-header-cell">S.no</th>
                  <th className="portal-table-header-cell">Date</th>
                  <th className="portal-table-header-cell">PDF</th>
                  <th className="portal-table-header-cell">Summary</th>
                  <th className="portal-table-header-cell">Status</th>
                  <th className="portal-table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="portal-table-body">
                {meetings.map((meeting, index) => (
                  <tr key={meeting.id} className="portal-table-row">
                    <td className="portal-table-cell">{index + 1}</td>
                    <td className="portal-table-cell">{new Date(meeting.date).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}</td>
                    <td className="portal-table-cell">
                      <a href="#" className="text-portal-blue hover:underline flex items-center">
                        <FileText size={16} className="mr-1" />
                        {meeting.file}
                      </a>
                    </td>
                    <td className="portal-table-cell">{meeting.summary}</td>
                    <td className="portal-table-cell">{getStatusBadge(meeting.status)}</td>
                    <td className="portal-table-cell">
                      {meeting.status === 'Draft' && (
                        <button className="text-portal-blue hover:underline">
                          Submit
                        </button>
                      )}
                      {meeting.status === 'Rejected' && (
                        <button className="text-portal-blue hover:underline">
                          View Feedback
                        </button>
                      )}
                      {meeting.status === 'Resubmit' && (
                        <button className="text-portal-blue hover:underline">
                          Resubmit
                        </button>
                      )}
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
            <h3 className="text-xl font-medium mb-2">No DC meetings recorded yet</h3>
            <p className="text-gray-500 mb-4">Upload your first DC meeting minutes to get started</p>
            <button 
              onClick={() => setShowModal(true)}
              className="portal-button-primary flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Log New Meeting
            </button>
          </div>
        </div>
      )}

      {/* Modal for adding new meeting */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Log New DC Meeting</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Date
                </label>
                <input
                  type="date"
                  className="portal-input"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Summary
                </label>
                <textarea
                  className="portal-input"
                  rows={3}
                  value={newMeeting.summary}
                  onChange={(e) => setNewMeeting({...newMeeting, summary: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Minutes (PDF/DOCX)
                </label>
                <div className="file-drop-area" onClick={() => document.getElementById('file-upload')?.click()}>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                  />
                  
                  {newMeeting.file ? (
                    <div className="flex items-center justify-center">
                      <FileText size={24} className="text-portal-blue mr-2" />
                      <span>{newMeeting.file.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-1">Supports PDF, DOCX</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="portal-button-primary flex items-center"
                >
                  <Check size={18} className="mr-2" />
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DCMeetings;
