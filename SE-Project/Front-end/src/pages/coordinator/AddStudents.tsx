
import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

const AddStudents: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          droppedFile.type === 'application/vnd.ms-excel') {
        setFile(droppedFile);
      } else {
        toast.error('Please upload only Excel files (.xlsx or .xls)');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile);
      } else {
        toast.error('Please upload only Excel files (.xlsx or .xls)');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
    
    setIsUploading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    setUploaded(true);
    toast.success('Student data imported successfully');
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add Students</h1>
        <p className="text-gray-600">Import student details from Excel sheet</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="portal-card p-6">
            <div
              className={`file-drop-area ${dragActive ? 'border-portal-blue bg-portal-lightBlue bg-opacity-30' : ''} ${file ? 'border-green-300 bg-green-50' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
              
              {file ? (
                <div className="flex flex-col items-center">
                  <div className="bg-green-100 p-3 rounded-full mb-3">
                    <FileText size={30} className="text-green-600" />
                  </div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                  {uploaded ? (
                    <div className="flex items-center text-green-600 mt-3">
                      <Check size={18} className="mr-1" />
                      <span>Successfully uploaded</span>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpload();
                      }}
                      className="mt-4 portal-button-primary"
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload File'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload size={40} className="text-gray-400 mb-3" />
                  <p className="font-medium text-gray-700">Drag & Drop your file here</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                  <p className="text-xs text-gray-400 mt-3">Supports Excel files (.xlsx, .xls)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="portal-card p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Instructions</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Info size={18} className="text-portal-blue mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm">The Excel sheet must contain student data in the following format.</p>
            </div>
            
            <div className="bg-portal-lightBlue p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-sm">Required Columns:</h3>
              <ul className="text-sm space-y-2">
                <li><span className="font-medium">Name:</span> Full name of the student</li>
                <li><span className="font-medium">Email:</span> Email address (will be used for login)</li>
                <li><span className="font-medium">Department:</span> Department code (e.g., CSED)</li>
                <li><span className="font-medium">Date of Joining:</span> Format: YYYY-MM-DD</li>
                <li><span className="font-medium">Admission Scheme:</span> (IF/JRF/QIP etc.)</li>
                <li><span className="font-medium">Research Area:</span> Major area of research</li>
              </ul>
            </div>
            
            <div className="flex items-start">
              <AlertCircle size={18} className="text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm">
                Students will need to use Google Sign-in with the email provided in the Excel sheet.
              </p>
            </div>
            
            <a 
              href="#" 
              download 
              className="flex items-center text-portal-blue hover:underline text-sm"
            >
              <FileText size={16} className="mr-1" />
              Download Sample Excel Template
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudents;
