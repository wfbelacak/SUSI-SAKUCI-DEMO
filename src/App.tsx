import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminComplaintDetail from "./pages/admin/AdminComplaintDetail";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminStatistics from "./pages/admin/AdminStatistics";
import AdminHistory from "./pages/admin/AdminHistory";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminReview from "./pages/admin/AdminReview";
import AdminArsip from "./pages/admin/AdminArsip";
import AdminSaranPublik from "./pages/admin/AdminSaranPublik";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentNewComplaint from "./pages/student/StudentNewComplaint";
import StudentComplaints from "./pages/student/StudentComplaints";
import StudentComplaintDetail from "./pages/student/StudentComplaintDetail";
import StudentHistory from "./pages/student/StudentHistory";
import StudentFeedback from "./pages/student/StudentFeedback";
import StudentProfile from "./pages/student/StudentProfile";
import NotFound from "./pages/NotFound";
import PublicFeedback from "./pages/PublicFeedback";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,   // 30 seconds — data considered fresh, won't refetch
      gcTime: 300_000,     // 5 minutes — unused data kept in cache
      refetchOnWindowFocus: false, // Don't refetch when user switches back to tab
      retry: 1,            // Only retry once on failure
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/SUSI-SAKUCI-DEMO">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/saran" element={<PublicFeedback />} />
              
              {/* Admin routes - Protected */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/complaints"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminComplaints />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/complaints/:id"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminComplaintDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminStudents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/statistics"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminStatistics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/history"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminCategories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/review"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminReview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/saran"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminSaranPublik />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/arsip"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminArsip />
                  </ProtectedRoute>
                }
              />
              
              {/* Student routes - Protected */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRole="siswa">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/new"
                element={
                  <ProtectedRoute allowedRole="siswa">
                    <StudentNewComplaint />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/complaints"
                element={
                  <ProtectedRoute allowedRole="siswa">
                    <StudentComplaints />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/complaints/:id"
                element={
                  <ProtectedRoute allowedRole="siswa">
                    <StudentComplaintDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/feedback"
                element={
                  <ProtectedRoute allowedRole="siswa">
                    <StudentFeedback />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/history"
                element={
                  <ProtectedRoute allowedRole="siswa">
                    <StudentHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRole="siswa">
                    <StudentProfile />
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
