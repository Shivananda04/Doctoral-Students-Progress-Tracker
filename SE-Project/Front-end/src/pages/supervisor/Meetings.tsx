import React, { useState, useEffect } from 'react';
import { FileText, Check, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface DCMeeting {
  id: number;
  date: string;
  summary: string;
  filename: string;
  status: 'Submitted' | 'Approved' | 'Rejected' | 'Resubmit';
  comments?: string;
  studentName: string;
  studentId: number;
}

const SupervisorDCMeetings: React.FC = () => {
  const [meetings, setMeetings] = useState<DCMeeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<DCMeeting | null>(null);
  const [comments, setComments] = useState('');
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get<DCMeeting[]>('http://localhost:8080/api/supervisor/dc-meetings', {
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem('token')}`
          // },
          withCredentials: true
        });
        setMeetings(response.data);
      } catch (error) {
        console.error('Error fetching meetings:', error);
        toast.error('Failed to load meetings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const handleDownload = async (meetingId: number, filename: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/dc-meetings/download/${meetingId}`, {
        responseType: 'blob',
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('token')}`,
        // }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleApprove = async (meetingId: number) => {
    // console.log('Approving meeting with ID:', meetingId, localStorage.getItem('token'));
    try {
      const response = await axios.put(
        `http://localhost:8080/api/supervisor/dc-meetings/${meetingId}/approve`,
        { 
          
        },
        { withCredentials: true }
      );

      setMeetings(meetings.map(meeting =>
        meeting.id === meetingId ? { ...meeting, status: 'Approved' } : meeting,
      ));
      toast.success('Meeting approved');
    } catch (error) {
      console.error('Approval error:', error);
      toast.error('Failed to approve meeting');
    }
  };

  const handleReject = async () => {
    if (!selectedMeeting || !comments.trim()) {
      toast.error('Please provide comments for rejection');
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8080/api/supervisor/dc-meetings/${selectedMeeting.id}/reject`,
        { comments },
        { withCredentials: true }
      );
  
      setMeetings(meetings.map(meeting =>
        meeting.id === selectedMeeting.id
          ? { ...meeting, status: 'Rejected', comments }
          : meeting
      ));
  
      setComments('');
      setSelectedMeeting(null);
      setShowCommentsModal(false);
      toast.success('Meeting rejected');
    } catch (error) {
      console.error('Rejection error:', error);
      toast.error('Failed to reject meeting');
    }
  };
  


  const openRejectModal = (meeting: DCMeeting) => {
    setSelectedMeeting(meeting);
    setShowCommentsModal(true);
  };

  const closeRejectModal = () => {
    setSelectedMeeting(null);
    setComments('');
    setShowCommentsModal(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Supervisor DC Meetings</h1>

      {isLoading ? (
        <p>Loading meetings...</p>
      ) : meetings.length === 0 ? (
        <p>No DC meetings submitted yet.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Student</th>
              <th className="p-3">Date</th>
              <th className="p-3">Summary</th>
              <th className="p-3">File</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting) => (
              <tr key={meeting.id} className="border-t">
                <td className="p-3">{meeting.studentName}</td>
                <td className="p-3">{meeting.date}</td>
                <td className="p-3">{meeting.summary}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDownload(meeting.id, meeting.filename)}
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {meeting.filename}
                  </button>
                </td>
                <td className="p-3 font-medium">{meeting.status}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleApprove(meeting.id)}
                    className="flex items-center text-green-600 hover:underline"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => openRejectModal(meeting)}
                    className="flex items-center text-red-600 hover:underline"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Comments Modal */}
      {showCommentsModal && selectedMeeting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Reject Meeting - {selectedMeeting.studentName}
            </h2>
            <textarea
              className="w-full border rounded p-2 mb-4"
              placeholder="Enter rejection comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeRejectModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorDCMeetings;
