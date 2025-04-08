import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { CalendarDays, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Announcement {
    id: number;
    name: string;
    date: string;
    deadline: string;
    venue: string;
  }
  

  interface ExamRequest {
    id: number;
    studentName: string;
    examName: string;
    status: "Pending" | "Approved" | "Rejected";
    feedback?: string;
  }
  

interface ExamResult {
  id: string;
  name: string;
  core: number;
  specialization: number;
}

const StudentExams: React.FC = () => {
  const { user } = useAuth();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [examDetails, setExamDetails] = useState({
    studentName: "",
    examName: "",
    description: ""
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

  const baseURL = "http://localhost:8080/api/student/exams";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsRes, requestsRes, resultsRes] = await Promise.all([
          axios.get(`${baseURL}/announcements`, { withCredentials: true }),
          axios.get(`${baseURL}/approved-requests`, { withCredentials: true }),
          axios.get(`${baseURL}/results`, { withCredentials: true }),
        ]);
        console.log("🧪 Announcements Data:", announcementsRes.data); // <-- ADD THIS LINE
        setAnnouncements(announcementsRes.data);
        setExamRequests(requestsRes.data);

        if (resultsRes.data && typeof resultsRes.data === "object" && resultsRes.data.id) {
          setExamResults([resultsRes.data]);
        } else {
          toast.error("Unexpected result format from server");
          setExamResults([]);
        }
      } catch (error: any) {
        toast.error("Failed to load exam data");
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExamDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = async () => {
    if (!examDetails.studentName || !examDetails.examName || !examDetails.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await axios.post(`${baseURL}/request`, examDetails, {
        withCredentials: true,
      });
      toast.success("Exam request submitted successfully");
      setIsFormVisible(false);
    } catch (error: any) {
      toast.error("Failed to submit exam request");
      console.error(error);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Exam Dashboard</h1>
        <Button onClick={() => setIsFormVisible((prev) => !prev)}>
          {isFormVisible ? "Cancel" : "Request an Exam"}
        </Button>
      </div>

      {isFormVisible && (
        <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Exam Request Form</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="text"
            name="studentName"
            placeholder="Student Name"
            value={examDetails.studentName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="examName"
            placeholder="Exam Name"
            value={examDetails.examName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={examDetails.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmitRequest}>Submit Request</Button>
        </CardFooter>
      </Card>
      
      )}

<Card>
  <CardHeader>
    <h2 className="text-xl font-semibold flex items-center gap-2">
      <CalendarDays className="w-5 h-5" /> Exam Announcements
    </h2>
  </CardHeader>
  <CardContent>
    {announcements.length === 0 ? (
      <p>No announcements yet.</p>
    ) : (
      <ul className="space-y-4">
        {announcements.map((a) => (
          <li key={a.id} className="border-b pb-2">
            <h3 className="text-lg font-bold">{a.name}</h3>
            <p className="text-sm text-gray-700 mb-1">Deadline: {a.deadline}</p>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>{a.date}</span>
              <FileText className="w-4 h-4 ml-4" />
              <span>{a.venue}</span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </CardContent>
</Card>



      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" /> Submitted Requests
          </h2>
        </CardHeader>
        <CardContent>
          {examRequests.length === 0 ? (
            <p>No exam requests submitted.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Studentname</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.examName}</TableCell>
                    <TableCell>{req.studentName}</TableCell>
                    <TableCell>{req.status}</TableCell>
                    <TableCell>{req.feedback || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Exam Results
          </h2>
        </CardHeader>
        <CardContent>
          {examResults.length === 0 ? (
            <p>No results available.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Core</TableHead>
                  <TableHead>Specialization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examResults.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell>{res.id}</TableCell>
                    <TableCell>{res.name}</TableCell>
                    <TableCell>{res.core}</TableCell>
                    <TableCell>{res.specialization}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentExams;
