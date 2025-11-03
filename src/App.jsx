import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Home from "@/components/pages/Home";
import Events from "@/components/pages/Events";
import EventDetails from "@/components/pages/EventDetails";
import About from "@/components/pages/About";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Dashboard from "@/components/pages/Dashboard";
import MyEvents from "@/components/pages/MyEvents";
import CreateEvent from "@/components/pages/CreateEvent";
import EditEvent from "@/components/pages/EditEvent";
import Profile from "@/components/pages/Profile";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

// Initialize ApperClient globally for email notifications
const initializeApperClient = () => {
  if (typeof window !== 'undefined' && window.ApperSDK) {
    window.apperClient = new window.ApperSDK.ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }
};
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  useEffect(() => {
    // Initialize ApperClient when SDK is loaded
    initializeApperClient();
    
    // Listen for SDK load event if it's not already loaded
    const handleSDKLoad = () => {
      initializeApperClient();
    };
    
    if (!window.ApperSDK) {
      window.addEventListener('ApperSDKLoaded', handleSDKLoad);
      return () => window.removeEventListener('ApperSDKLoaded', handleSDKLoad);
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/about" element={<About />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/my-events" element={
                <ProtectedRoute>
                  <MyEvents />
                </ProtectedRoute>
              } />
              <Route path="/create-event" element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              } />
              <Route path="/edit-event/:id" element={
                <ProtectedRoute>
                  <EditEvent />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="text-sm"
            style={{ zIndex: 9999 }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;