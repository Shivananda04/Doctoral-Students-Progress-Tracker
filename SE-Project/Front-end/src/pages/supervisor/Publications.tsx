import React, { useState, useEffect } from 'react';
import { BookMarked, Plus, Link as LinkIcon, Search, X, Trash, Calendar, FileText, Check, Mail } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { isAxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/publicationss';

interface Publication {
  id: number;
  title: string;
  journal: string;
  authors: string;
  date: string;
  doi?: string;
  type: string;
  status: 'Submitted' | 'Editorial Revision' | 'Accepted' | 'Published';
  impactFactor?: number;
  email?: string;
}

const SupervisorPublications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [newStatus, setNewStatus] = useState<'Accepted' | 'Published' | 'Rejected'>('Accepted');

  useEffect(() => {
    const fetchPendingPublications = async () => {
      try {
        const response = await axios.get<Publication[]>(`${API_BASE_URL}?status=Submitted`);
        setPublications(response.data);
      } catch (error) {
        toast.error('Failed to fetch publications');
        console.error('Error fetching publications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingPublications();
  }, []);

  const handleStatusUpdate = async () => {
   
    
    try {
      const response = await axios.put(
        `${API_BASE_URL}/${selectedPublication.id}/status`,
        { 
          status: newStatus // Include the status in the request body
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setPublications(publications.filter(pub => pub.id !== selectedPublication.id));
      toast.success(`Publication status updated to ${newStatus}`);
      setSelectedPublication(null);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to update status');
      } else {
        toast.error('Failed to update status');
      }
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, { withCredentials: true });
      setPublications(publications.filter((publication) => publication.id !== id));
      toast.success('Publication deleted successfully');
    } catch (error) {
      toast.error('Failed to delete publication');
      console.error('Error deleting publication:', error);
    }
  };

  const filteredPublications = publications.filter((publication) =>
    publication.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    publication.journal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    publication.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Submitted</span>;
      case 'Editorial Revision':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Editorial Revision</span>;
      case 'Accepted':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Accepted</span>;
      case 'Published':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Published</span>;
      case 'Rejected':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Publications for Review</h1>
          <p className="text-gray-600">Review and approve student publications</p>
        </div>
      </div>

      {publications.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="portal-input pl-10"
              placeholder="Search publications by title, journal, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {filteredPublications.length > 0 ? (
        <div className="space-y-6">
          {filteredPublications.map((publication) => (
            <div key={publication.id} className="portal-card p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold mb-2">{publication.title}</h3>
                    {getStatusBadge(publication.status)}
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Journal:</span> {publication.journal}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Authors:</span> {publication.authors}
                  </p>
                  <div className="flex items-center text-sm text-gray-700 mb-1">
                    <Calendar size={16} className="mr-2" />
                    <span>
                      <span className="font-medium">Date:</span> {new Date(publication.date).toLocaleDateString()}
                    </span>
                  </div>
                  {publication.doi && (
                    <div className="flex items-center text-sm text-gray-700 mb-1">
                      <LinkIcon size={16} className="mr-2" />
                      <span>
                        <span className="font-medium">DOI:</span>{' '}
                        <a
                          href={`https://doi.org/${publication.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-portal-blue hover:underline"
                        >
                          {publication.doi}
                        </a>
                      </span>
                    </div>
                  )}
                  {publication.email && (
                    <div className="flex items-center text-sm text-gray-700 mb-1">
                      <Mail size={16} className="mr-2" />
                      <span>
                        <span className="font-medium">Contact:</span> {publication.email}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-700 mb-1">
                    <FileText size={16} className="mr-2" />
                    <span>
                      <span className="font-medium">Type:</span> {publication.type}
                    </span>
                  </div>
                  {publication.impactFactor && (
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">Impact Factor:</span> {publication.impactFactor}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end ml-4 space-y-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedPublication(publication);
                        setNewStatus('Accepted');
                      }}
                      className="portal-button-success text-sm flex items-center"
                    >
                      <Check size={16} className="mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPublication(publication);
                        setNewStatus('Rejected');
                      }}
                      className="portal-button-danger text-sm flex items-center"
                    >
                      <X size={16} className="mr-2" />
                      Reject
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(publication.id)}
                    className="portal-button-danger text-sm flex items-center"
                  >
                    <Trash size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="portal-card p-8 text-center">
          <div className="flex flex-col items-center">
            <BookMarked size={48} className="text-gray-300 mb-4" />
            {searchQuery ? (
              <>
                <h3 className="text-xl font-medium mb-2">No publications found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium mb-2">No publications to review</h3>
                <p className="text-gray-500 mb-4">All submissions have been processed</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Status Update Confirmation Modal */}
      {selectedPublication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {newStatus === 'Accepted' ? 'Approve Publication' : 'Reject Publication'}
              </h2>
              <button 
                onClick={() => setSelectedPublication(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="mb-4">Are you sure you want to {newStatus === 'Accepted' ? 'approve' : 'reject'} this publication?</p>
              <h3 className="font-medium mb-2">{selectedPublication.title}</h3>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Journal:</span> {selectedPublication.journal}
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setSelectedPublication(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleStatusUpdate}
                className={`px-4 py-2 rounded-md text-white flex items-center ${
                  newStatus === 'Accepted' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <Check size={18} className="mr-2" />
                Confirm {newStatus === 'Accepted' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorPublications; 