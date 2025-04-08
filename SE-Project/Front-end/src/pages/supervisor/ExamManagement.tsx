import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

interface ExamRequest {
    id: number;
    studentName: string;
    examName: string; // 
  }
  

const ExamManagement = () => {
  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]);

  const baseURL = "http://localhost:8080/api/supervisor/exams";

  // Fetch all pending exam requests
  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get(`${baseURL}/requests`, {
        withCredentials: true,
      });
      setExamRequests(res.data);
    } catch (error) {
      toast.error("Failed to load exam requests");
      console.error(error);
    }
  };

  // Approve exam request
  const handleApprove = async (id: number) => {
    try {
      await axios.post(`${baseURL}/${id}/approve`, {}, { withCredentials: true });
      toast.success("Request approved");
      setExamRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      toast.error("Failed to approve");
      console.error(error);
    }
  };

  // Reject exam request
  const handleReject = async (id: number) => {
    try {
      await axios.post(`${baseURL}/${id}/reject`, {}, { withCredentials: true });
      toast.success("Request rejected");
      setExamRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      toast.error("Failed to reject");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Exam Request Management</h1>

      {examRequests.length > 0 ? (
        examRequests.map((request) => (
          <Card key={request.id} className="mb-4">
          <CardHeader>
  <h2 className="text-lg font-semibold">{request.examName}</h2>
  <p className="text-sm text-gray-600">Student: {request.studentName}</p>
</CardHeader>
            <div className="p-4 flex justify-end gap-4">
              <Button variant="default" onClick={() => handleApprove(request.id)}>
                Approve
              </Button>
              <Button variant="destructive" onClick={() => handleReject(request.id)}>
                Reject
              </Button>
            </div>
          </Card>
        ))
      ) : (
        <p className="text-gray-600">No pending exam requests.</p>
      )}
    </div>
  );
};

export default ExamManagement;
