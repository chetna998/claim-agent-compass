
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AgentDashboard from "./pages/AgentDashboard";
import Claims from "./pages/Claims";
import ClaimDetails from "./pages/ClaimDetails";
import NewClaim from "./pages/NewClaim";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Agents from "./pages/Agents"; // Add import for Agents page

const queryClient = new QueryClient();

// Protected route that checks if user is authenticated
const ProtectedRoute = ({ 
  children, 
  allowedRoles = undefined
}: { 
  children: React.ReactNode, 
  allowedRoles?: string[] 
}) => {
  const { isAuthenticated, loading, userProfile } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If there are role restrictions and the user's role is not included
  if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) {
    // Redirect agents to agent dashboard, admins to admin dashboard
    return <Navigate to={userProfile.role === 'admin' ? '/dashboard' : '/agent-dashboard'} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { userProfile } = useAuth();
  
  // Determine the dashboard route based on user role
  const DashboardRoute = () => {
    if (!userProfile) return <Navigate to="/" />;
    return userProfile.role === 'admin' ? <Navigate to="/dashboard" /> : <Navigate to="/agent-dashboard" />;
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* When authenticated users visit root, redirect to appropriate dashboard */}
      <Route path="/home" element={<ProtectedRoute><DashboardRoute /></ProtectedRoute>} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/agent-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['agent']}>
            <AgentDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/claims" 
        element={
          <ProtectedRoute>
            <Claims />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/claims/:id" 
        element={
          <ProtectedRoute>
            <ClaimDetails />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/new-claim" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <NewClaim />
          </ProtectedRoute>
        } 
      />
      
      {/* Add Agents route */}
      <Route 
        path="/agents" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Agents />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
