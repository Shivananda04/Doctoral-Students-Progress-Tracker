import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface ExamRequest {
  id: number;
  studentName: string;
  examName: string;
  supervisorApproval: boolean;
  status: "Pending" | "Approved" | "Rejected";
}

const ExamManagement = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [examDetails, setExamDetails] = useState({
    name: "",
    date: "",
    deadline: "",
    venue: "",
    duration: "",
    shift: "",
  });

  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]);

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/student/exams/approved-requests",
          { withCredentials: true }
        );
        setExamRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch approved requests:", error);
      }
    };

    fetchApprovedRequests();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExamDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8080/api/exams/announce", examDetails, {
        withCredentials: true,
      });
      toast.success("Exam announced successfully");
      setExamDetails({
        name: "",
        date: "",
        deadline: "",
        venue: "",
        duration: "",
        shift: "",
      });
      setIsFormVisible(false);
    } catch (error: any) {
      console.error("Error adding exam:", error);
      toast.error("Failed to add exam");
    }
  };


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post("http://localhost:8080/api/results/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true // if your backend uses cookies for auth
      });
  
      console.log("Upload response:", response.data);
      toast.success("Results published successfully");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Failed to upload results");
    }
  };
  

  const approvedRequests = examRequests.filter(
    (request) => request.supervisorApproval && request.status === "Approved"
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Exam Management</h1>

      {/* Add Exam Section */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Add New Exam</h2>
        </CardHeader>
        <div className="p-4">
          <Button
            className="portal-button-primary"
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            {isFormVisible ? "Cancel" : "Add Exam"}
          </Button>
          {isFormVisible && (
            <div className="mt-4 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Exam Name"
                value={examDetails.name}
                onChange={handleInputChange}
                className="portal-input"
              />
              <input
                type="date"
                name="date"
                placeholder="Exam Date"
                value={examDetails.date}
                onChange={handleInputChange}
                className="portal-input"
              />
              <input
                type="date"
                name="deadline"
                placeholder="Application Deadline"
                value={examDetails.deadline}
                onChange={handleInputChange}
                className="portal-input"
              />
              <input
                type="text"
                name="venue"
                placeholder="Exam Venue"
                value={examDetails.venue}
                onChange={handleInputChange}
                className="portal-input"
              />
              <input
                type="text"
                name="duration"
                placeholder="Exam Duration (e.g., 2 hours)"
                value={examDetails.duration}
                onChange={handleInputChange}
                className="portal-input"
              />
              <input
                type="text"
                name="shift"
                placeholder="Exam Shift (e.g., Morning)"
                value={examDetails.shift}
                onChange={handleInputChange}
                className="portal-input"
              />
              <Button
                className="portal-button-primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Approved Exam Requests Section */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Approved Exam Requests</h2>
        </CardHeader>
        <div className="p-4">
          {approvedRequests.length > 0 ? (
            <table className="portal-table">
              <thead className="portal-table-header">
                <tr>
                  <th className="portal-table-header-cell">S.no</th>
                  <th className="portal-table-header-cell">Student Name</th>
                  <th className="portal-table-header-cell">Exam Name</th>
                  <th className="portal-table-header-cell">Status</th>
                </tr>
              </thead>
              <tbody className="portal-table-body">
                {approvedRequests.map((request, index) => (
                  <tr key={request.id} className="portal-table-row">
                    <td className="portal-table-cell">{index + 1}</td>
                    <td className="portal-table-cell">{request.studentName}</td>
                    <td className="portal-table-cell">{request.examName}</td>
                    <td className="portal-table-cell">
                      <span className="portal-status-approved">
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">No approved exam requests available.</p>
          )}
        </div>
      </Card>

      {/* Publish Results Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Publish Results</h2>
        </CardHeader>
        <div className="p-4">
          <label
            htmlFor="upload-results"
            className="portal-button-primary flex items-center cursor-pointer"
          >
            <Upload size={16} className="mr-2" />
            Upload Results
          </label>
          <input
            id="upload-results"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </Card>
    </div>
  );
};

export default ExamManagement;