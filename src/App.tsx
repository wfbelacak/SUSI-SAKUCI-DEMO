import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminComplaintDetail from "./pages/admin/AdminComplaintDetail";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentNewComplaint from "./pages/student/StudentNewComplaint";
import StudentComplaints from "./pages/student/StudentComplaints";
import StudentComplaintDetail from "./pages/student/StudentComplaintDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/admin/complaints/:id" element={<AdminComplaintDetail />} />
          <Route path="/admin/statistics" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminDashboard />} />
          <Route path="/admin/history" element={<AdminComplaints />} />
          
          {/* Student routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/new" element={<StudentNewComplaint />} />
          <Route path="/student/complaints" element={<StudentComplaints />} />
          <Route path="/student/complaints/:id" element={<StudentComplaintDetail />} />
          <Route path="/student/feedback" element={<StudentComplaints />} />
          <Route path="/student/history" element={<StudentComplaints />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
