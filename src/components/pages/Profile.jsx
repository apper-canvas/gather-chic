import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { eventService } from "@/services/api/eventService";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    eventsCreated: 0,
    eventsAttended: 0,
    totalViews: 0
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: ""
  });
  const [errors, setErrors] = useState({});

  const loadUserStats = async () => {
    try {
      const allEvents = await eventService.getAll();
      // Mock user stats (in real app, this would come from API)
      const userEvents = allEvents.filter((event, index) => index % 3 === 0);
      
      setStats({
        eventsCreated: userEvents.length,
        eventsAttended: 12,
        totalViews: userEvents.length * 15 + Math.floor(Math.random() * 100)
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || ""
      });
    }
    loadUserStats();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (formData.website && !formData.website.startsWith("http")) {
      newErrors.website = "Website URL must start with http:// or https://";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in auth context
      updateUser(formData);
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || ""
    });
    setErrors({});
    setIsEditing(false);
  };

  if (!user) return <Loading />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-white">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-secondary mb-2">
                {user.name}
              </h2>
              
              <p className="text-gray-600 mb-6">
                {user.email}
              </p>
              
              {user.bio && (
                <p className="text-sm text-gray-600 mb-6">
                  {user.bio}
                </p>
              )}
              
              {/* User Stats */}
              <div className="grid grid-cols-1 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.eventsCreated}</div>
                  <div className="text-xs text-gray-500">Events Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{stats.eventsAttended}</div>
                  <div className="text-xs text-gray-500">Events Attended</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{stats.totalViews}</div>
                  <div className="text-xs text-gray-500">Profile Views</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold text-secondary flex items-center gap-2">
                  <ApperIcon name="User" size={20} className="text-primary" />
                  Personal Information
                </h3>
                
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name="Edit" size={16} />
                    Edit Profile
                  </Button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                    
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      disabled={!isEditing}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <Textarea
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    error={errors.bio}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      error={errors.location}
                      disabled={!isEditing}
                      placeholder="Your city, country"
                    />
                    
                    <Input
                      label="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      error={errors.website}
                      disabled={!isEditing}
                      placeholder="https://your-website.com"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 sm:flex-auto"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Saving Changes...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <ApperIcon name="Save" size={16} />
                          Save Changes
                        </div>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </Card>
          </motion.div>
        </div>

        {/* Account Settings */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8">
            <h3 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
              <ApperIcon name="Settings" size={20} className="text-primary" />
              Account Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
                <h4 className="font-medium text-secondary mb-2">Email Notifications</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Receive updates about your events and registrations
                </p>
                <Button variant="outline" size="sm">
                  Manage Preferences
                </Button>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-accent/5 to-accent/10 rounded-lg">
                <h4 className="font-medium text-secondary mb-2">Privacy Settings</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Control who can see your profile and events
                </p>
                <Button variant="outline" size="sm">
                  Update Privacy
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;