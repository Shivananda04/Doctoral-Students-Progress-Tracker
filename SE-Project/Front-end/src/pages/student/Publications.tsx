
import React, { useState } from 'react';
import { BookMarked, Plus, Link as LinkIcon, Search, X, Check, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

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
}

const Publications: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  
  // Mock data
  const [publications, setPublications] = useState<Publication[]>([
    {
      id: 1,
      title: 'A Novel Approach to Natural Language Processing Using Deep Learning',
      journal: 'IEEE Transactions on Neural Networks',
      authors: 'John Doe, Jane Smith, Robert Johnson',
      date: '2023-03-02',
      doi: '10.1016/j.jare.2021.08.003',
      type: 'Scopus Indexed',
      status: 'Published',
      impactFactor: 3.8
    },
    {
      id: 2,
      title: 'Improvements in Blockchain Security Protocols for IoT Applications',
      journal: 'Journal of Cryptographic Engineering',
      authors: 'John Doe, Emily Chen',
      date: '2023-02-15',
      type: 'Web of Science',
      status: 'Accepted',
      impactFactor: 2.5
    },
    {
      id: 3,
      title: 'Machine Learning Applications in Healthcare: A Comparative Study',
      journal: 'Journal of Biomedical Informatics',
      authors: 'John Doe, Sarah Williams',
      date: '2023-01-20',
      type: 'Scopus Indexed',
      status: 'Editorial Revision',
    },
  ]);

  const [newPublication, setNewPublication] = useState({
    title: '',
    journal: '',
    authors: '',
    date: '',
    doi: '',
    type: 'Journal',
    status: 'Submitted' as const,
  });

  const [newStatus, setNewStatus] = useState<'Submitted' | 'Editorial Revision' | 'Accepted' | 'Published'>('Submitted');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!newPublication.title || !newPublication.journal || !newPublication.authors || !newPublication.date) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Add new publication
    const newPublicationObj: Publication = {
      id: publications.length + 1,
      ...newPublication,
    };
    
    setPublications([...publications, newPublicationObj]);
    setNewPublication({
      title: '',
      journal: '',
      authors: '',
      date: '',
      doi: '',
      type: 'Journal',
      status: 'Submitted',
    });
    setShowModal(false);
    
    toast.success('Publication added successfully');
    
    // Simulate API fetch for impact factor
    setTimeout(() => {
      const updatedPublications = [...publications, newPublicationObj].map(pub => {
        if (pub.id === newPublicationObj.id) {
          return { ...pub, impactFactor: 2.3 };
        }
        return pub;
      });
      
      setPublications(updatedPublications);
      toast.success('Impact factor information updated automatically');
    }, 2000);
  };

  const handleStatusUpdate = () => {
    if (!selectedPublication || !newStatus) return;
    
    const updatedPublications = publications.map(pub => {
      if (pub.id === selectedPublication.id) {
        return { ...pub, status: newStatus };
      }
      return pub;
    });
    
    setPublications(updatedPublications);
    setShowStatusModal(false);
    toast.success(`Publication status updated to ${newStatus}`);
  };

  const filteredPublications = publications.filter(publication => 
    publication.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    publication.journal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    publication.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <span className="portal-status-draft">Submitted</span>;
      case 'Editorial Revision':
        return <span className="portal-status-pending">Editorial Revision</span>;
      case 'Accepted':
        return <span className="portal-status-approved">Accepted</span>;
      case 'Published':
        return <span className="portal-status-approved">Published</span>;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Publications</h1>
          <p className="text-gray-600">Manage your research publications and track their status</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="portal-button-primary flex items-center"
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
                  <h3 className="font-semibold mb-2">{publication.title}</h3>
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
                
                <div className="flex flex-col items-end ml-4">
                  {getStatusBadge(publication.status)}
                  
                  <button
                    onClick={() => {
                      setSelectedPublication(publication);
                      setNewStatus(publication.status);
                      setShowStatusModal(true);
                    }}
                    className="mt-4 portal-button-secondary text-sm"
                  >
                    Update Status
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
                <h3 className="text-xl font-medium mb-2">No publications yet</h3>
                <p className="text-gray-500 mb-4">Add your first publication to get started</p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="portal-button-primary flex items-center"
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
                  className="portal-input"
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
                  className="portal-input"
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
                  className="portal-input"
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
                    className="portal-input"
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
                    className="portal-input"
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
                  className="portal-input"
                  placeholder="e.g. 10.1016/j.jare.2021.08.003"
                  value={newPublication.doi}
                  onChange={(e) => setNewPublication({...newPublication, doi: e.target.value})}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publication Status
                </label>
                <select
                  className="portal-input"
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
                  className="portal-button-primary flex items-center"
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
                className="portal-input"
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
                className="portal-button-primary flex items-center"
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
