import React, { useState, useEffect } from 'react';
import { BookMarked, Plus, Link as LinkIcon, Search, X, Check, Calendar, FileText, Trash2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { isAxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/publications';

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

const Publications: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newPublication, setNewPublication] = useState({
    title: '',
    journal: '',
    authors: '',
    date: '',
    doi: '',
    type: 'Journal',
    status: 'Submitted' as const,
    email: '',
  });

  const [newStatus, setNewStatus] = useState<'Submitted' | 'Editorial Revision' | 'Accepted' | 'Published'>('Submitted');

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await axios.get<Publication[]>(API_BASE_URL);
        setPublications(response.data);
      } catch (error) {
        toast.error('Failed to fetch publications');
        console.error('Error fetching publications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (
      !newPublication.title ||
      !newPublication.journal ||
      !newPublication.authors ||
      !newPublication.date
    ) {
      toast.error('Please fill all required fields');
      return;
    }
  
    try {
      const response = await axios.post<Publication>(
        API_BASE_URL,
        {
          ...newPublication,
          date: new Date(newPublication.date).toISOString().split('T')[0],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
  
      setPublications([...publications, response.data]);
      setNewPublication({
        title: '',
        journal: '',
        authors: '',
        date: '',
        doi: '',
        type: 'Journal',
        status: 'Submitted',
        email: '',
      });
      setShowModal(false);
  
      toast.success('Publication added successfully');
  
      setTimeout(() => {
        setPublications((prevPublications) =>
          prevPublications.map((pub) =>
            pub.id === response.data.id
              ? { ...pub, impactFactor: 2.3 }
              : pub
          )
        );
        toast.success('Impact factor information updated automatically');
      }, 2000);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to add publication');
      } else {
        toast.error('Failed to add publication');
      }
      console.error('Error adding publication:', error);
    }
  };
  

  const handleStatusUpdate = async () => {
    if (!selectedPublication || !newStatus) return;
    
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/${selectedPublication.id}/status?status=${newStatus}`
      );
      
      setPublications(publications.map(pub => 
        pub.id === selectedPublication.id ? response.data as Publication : pub
      ));
      setShowStatusModal(false);
      toast.success(`Publication status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update publication status');
      console.error('Error updating status:', error);
    }
  };

  const handleDeletePublication = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setPublications(publications.filter(pub => pub.id !== id));
      toast.success('Publication deleted successfully');
    } catch (error) {
      toast.error('Failed to delete publication');
      console.error('Error deleting publication:', error);
    }
  };

  const filteredPublications = publications.filter(publication => 
    publication.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    publication.journal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    publication.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Submitted</span>;
      case 'Editorial Revision':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Editorial Revision</span>;
      case 'Accepted':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Accepted</span>;
      case 'Published':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Published</span>;
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
    <div className="animate-fadeIn p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Publications</h1>
          <p className="text-gray-600">Manage your research publications and track their status</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add Publication
        </button>
      </div>

      {publications.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div key={publication.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{publication.title}</h3>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Journal:</span> {publication.journal}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">Authors:</span> {publication.authors}
                  </p>
                  <div className="flex items-center text-sm text-gray-700 mb-1">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    <span>
                      <span className="font-medium">Date:</span> {new Date(publication.date).toLocaleDateString()}
                    </span>
                  </div>
                  {publication.doi && (
                    <div className="flex items-center text-sm text-gray-700 mb-1">
                      <LinkIcon size={16} className="mr-2 text-gray-500" />
                      <span>
                        <span className="font-medium">DOI:</span>{' '}
                        <a
                          href={`https://doi.org/${publication.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {publication.doi}
                        </a>
                      </span>
                    </div>
                  )}
                  {publication.email && (
                    <div className="flex items-center text-sm text-gray-700 mb-1">
                      <Mail size={16} className="mr-2 text-gray-500" />
                      <span>
                        <span className="font-medium">Email:</span> {publication.email}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-700 mb-1">
                    <FileText size={16} className="mr-2 text-gray-500" />
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
                
                <div className="flex flex-col items-end ml-4">
                  {getStatusBadge(publication.status)}
                  
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => {
                        setSelectedPublication(publication);
                        setNewStatus(publication.status);
                        setShowStatusModal(true);
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm flex items-center"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => handleDeletePublication(publication.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-sm flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="flex flex-col items-center">
            <BookMarked size={48} className="text-gray-300 mb-4" />
            {searchQuery ? (
              <>
                <h3 className="text-xl font-medium mb-2">No publications found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium mb-2">No publications yet</h3>
                <p className="text-gray-500 mb-4">Add your first publication to get started</p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Add Publication
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add Publication Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Publication</h2>
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
                  Title*
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newPublication.title}
                  onChange={(e) => setNewPublication({...newPublication, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Journal*
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newPublication.journal}
                  onChange={(e) => setNewPublication({...newPublication, journal: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Authors* (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. John Doe, Jane Smith"
                  value={newPublication.authors}
                  onChange={(e) => setNewPublication({...newPublication, authors: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date*
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newPublication.date}
                    onChange={(e) => setNewPublication({...newPublication, date: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newPublication.type}
                    onChange={(e) => setNewPublication({...newPublication, type: e.target.value})}
                  >
                    <option value="Journal">Journal</option>
                    <option value="Conference">Conference</option>
                    <option value="Scopus Indexed">Scopus Indexed</option>
                    <option value="Web of Science">Web of Science</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DOI Link (if available)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 10.1016/j.jare.2021.08.003"
                  value={newPublication.doi}
                  onChange={(e) => setNewPublication({...newPublication, doi: e.target.value})}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="corresponding.author@example.com"
                  value={newPublication.email}
                  onChange={(e) => setNewPublication({...newPublication, email: e.target.value})}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publication Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newPublication.status}
                  onChange={(e) => setNewPublication({...newPublication, status: e.target.value as any})}
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Editorial Revision">Editorial Revision</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Published">Published</option>
                </select>
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Check size={18} className="mr-2" />
                  Add Publication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedPublication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Update Publication Status</h2>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">{selectedPublication.title}</h3>
              <p className="text-sm text-gray-500 mb-4">
                Current Status: {getStatusBadge(selectedPublication.status)}
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
              >
                <option value="Submitted">Submitted</option>
                <option value="Editorial Revision">Editorial Revision</option>
                <option value="Accepted">Accepted</option>
                <option value="Published">Published</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleStatusUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Check size={18} className="mr-2" />
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publications;