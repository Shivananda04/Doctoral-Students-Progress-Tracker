import React, { useState, useEffect } from 'react';
import { FileText, Upload, Calendar, Plus, X, Check, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface DCMeeting {
  id: number;
  date: string;
  summary: string;
  filename: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Resubmit';
  comments?: string;
}

const DCMeetings: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [meetings, setMeetings] = useState<DCMeeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMeeting, setNewMeeting] = useState({
    date: '',
    summary: '',
    file: null as File | null,
  });

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<DCMeeting[]>('http://localhost:8080/api/dc-meetings/all', {
        withCredentials: true,
      });
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setError('Failed to load meetings. Please try again later.');
      toast.error('Failed to fetch meetings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewMeeting({ ...newMeeting, file: e.target.files[0] });
    }
  };

  const handleDownload = async (meetingId: number, filename: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/dc-meetings/download/${meetingId}`, {
        responseType: 'blob',
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleUpload = async () => {
    if (!newMeeting.date || !newMeeting.summary || !newMeeting.file) {
      toast.error('Please fill all fields and select a file');
      return;
    }

    const formData = new FormData();
    formData.append('date', newMeeting.date);
    formData.append('summary', newMeeting.summary);
    formData.append('file', newMeeting.file);

    try {
      setIsSubmitting(true);
      await axios.post('http://localhost:8080/api/dc-meetings/do', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Meeting uploaded successfully');
      setShowModal(false);
      setNewMeeting({ date: '', summary: '', file: null });
      fetchMeetings(); // refresh after upload
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">DC Meetings</h2>
        <div className="flex gap-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => setShowModal(true)}
          >
            <Plus className="inline-block mr-1" size={16} /> Upload Meeting
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={fetchMeetings}
          >
            <RefreshCw className="inline-block mr-1" size={16} /> Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading meetings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Summary</th>
              <th className="p-2 border">File</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Comments</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map(meeting => (
              <tr key={meeting.id} className="text-center">
                <td className="p-2 border">{meeting.date}</td>
                <td className="p-2 border">{meeting.summary}</td>
                <td className="p-2 border">{meeting.filename}</td>
                <td className="p-2 border">{meeting.status}</td>
                <td className="p-2 border">{meeting.comments || '-'}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDownload(meeting.id, meeting.filename)}
                    className="text-blue-500 hover:underline"
                  >
                    <Download size={16} className="inline-block" /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Upload New DC Meeting</h3>
            <input
              type="date"
              className="w-full mb-2 p-2 border rounded"
              value={newMeeting.date}
              onChange={e => setNewMeeting({ ...newMeeting, date: e.target.value })}
            />
            <textarea
              className="w-full mb-2 p-2 border rounded"
              placeholder="Enter summary"
              value={newMeeting.summary}
              onChange={e => setNewMeeting({ ...newMeeting, summary: e.target.value })}
            />
            <input
              type="file"
              className="w-full mb-2"
              onChange={handleFileChange}
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                <X size={16} /> Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleUpload}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Uploading...' : <><Upload className="inline-block mr-1" size={16} /> Upload</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DCMeetings;
