
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Auth
import Login from "./pages/auth/Login";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentMeetings from "./pages/student/Meetings";
import StudentPublications from "./pages/student/Publications";
import StudentSwayam from "./pages/student/Swayam";
import StudentExams from "./pages/student/Exams";

// Supervisor pages
import SupervisorDashboard from "./pages/supervisor/Dashboard";
import SupervisorMeetings from "./pages/supervisor/Meetings";
import SupervisorPublications from "./pages/supervisor/Publications";
import SupervisorSwayam from "./pages/supervisor/Swayam";
import SupervisorExams from "./pages/supervisor/ExamManagement";
// Coordinator pages
import CoordinatorDashboard from "./pages/coordinator/Dashboard";
import AddStudents from "./pages/coordinator/AddStudents";
import SwayamApprovals from "./pages/coordinator/SwayamApprovals";
import ExamManagement from "./pages/coordinator/ExamManagement";
import Students from "./pages/coordinator/Students";

// Shared pages
import Profile from "./pages/shared/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/" element={<AppLayout />}>
              {/* Root redirect */}
              <Route index element={<Navigate to="/login" replace />} />
              
              {/* Student routes */}
              <Route path="student">
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="meetings" element={<StudentMeetings />} />
                <Route path="publications" element={<StudentPublications />} />
                <Route path="swayam" element={<StudentSwayam />} />
                <Route path="exams" element={<StudentExams />} />
                {/* Add more student routes here */}
              </Route>
              
              {/* Supervisor routes */}
              <Route path="supervisor">
                <Route path="dashboard" element={<SupervisorDashboard />} />
                <Route path="meetings" element={<SupervisorMeetings />} />
                <Route path="publications" element={<SupervisorPublications />} />
                <Route path="swayam" element={<SupervisorSwayam />} />
                <Route path="exams" element={<SupervisorExams />} />
                {/* Add more supervisor routes here */}
              </Route>
              
              {/* Coordinator routes */}
              <Route path="coordinator">
                <Route path="dashboard" element={<CoordinatorDashboard />} />
                <Route path="add-students" element={<AddStudents />} />
                <Route path="swayam-approvals" element={<SwayamApprovals />} />
                <Route path="exam-management" element={<ExamManagement />} />
                <Route path="students" element={<Students />} />
                {/* Add more coordinator routes here */}
              </Route>
              
              {/* Shared routes */}
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<h1>Settings Page</h1>} />
              <Route path="help" element={<h1>Help Center</h1>} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
