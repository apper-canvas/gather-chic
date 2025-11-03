import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const storedUser = localStorage.getItem("gather_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("gather_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
try {
      const user = {
        ...userData,
        bio: userData.bio || "",
        location: userData.location || "",
        website: userData.website || "",
        email: userData.email || ""
      };
      
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("gather_user", JSON.stringify(user));
      
      // Send welcome email for new user registration
      if (userData.isNewUser && userData.email) {
        try {
          const { ApperClient } = window.ApperSDK || {};
          if (ApperClient) {
            const apperClient = new ApperClient({
              apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
              apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
            });

            const emailData = {
              type: 'welcome',
              to: userData.email,
              data: {
                userName: userData.name || 'New User',
                userEmail: userData.email
              }
            };

            await apperClient.functions.invoke(import.meta.env.VITE_SEND_NOTIFICATION_EMAIL, {
              body: JSON.stringify(emailData),
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }
        } catch (emailError) {
          console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SEND_NOTIFICATION_EMAIL}. The error is: ${emailError.message}`);
        }
      }
      
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("gather_user");
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("gather_user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};