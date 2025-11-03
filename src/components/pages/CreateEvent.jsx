import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import { eventService } from "@/services/api/eventService";
import { useAuth } from "@/hooks/useAuth";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    capacity: "",
    imageUrl: ""
  });
  const [errors, setErrors] = useState({});

  const categories = [
    "Technology",
    "Business", 
    "Arts",
    "Sports",
    "Education",
    "Community"
  ];

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
    
    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Event description is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    
    if (!formData.date) {
      newErrors.date = "Event date is required";
    } else {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        newErrors.date = "Event date must be in the future";
      }
    }
    
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }
    
    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = "End time must be after start time";
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Event location is required";
    }
    
    if (!formData.capacity) {
      newErrors.capacity = "Capacity is required";
    } else if (parseInt(formData.capacity) < 1) {
      newErrors.capacity = "Capacity must be at least 1";
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
      const eventData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        organizerId: user?.id || "current-user",
        isFeatured: false,
        imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"
      };
      
      const newEvent = await eventService.create(eventData);
      toast.success("Event created successfully!");
      navigate(`/events/${newEvent.Id}`);
    } catch (error) {
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            Create New Event
          </h1>
          <p className="text-gray-600">
            Share your passion and bring people together
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <ApperIcon name="Info" size={20} className="text-primary" />
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <Input
                      label="Event Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      error={errors.title}
                      placeholder="Enter a compelling event title"
                    />
                  </div>
                  
                  <div className="lg:col-span-2">
                    <Textarea
                      label="Event Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      error={errors.description}
                      rows={4}
                      placeholder="Describe what attendees can expect from your event..."
                    />
                  </div>
                  
                  <Select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    error={errors.category}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Select>
                  
                  <Input
                    label="Event Image URL (Optional)"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    error={errors.imageUrl}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <ApperIcon name="Calendar" size={20} className="text-primary" />
                  Date & Time
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Event Date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    error={errors.date}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  
                  <Input
                    label="Start Time"
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    error={errors.startTime}
                  />
                  
                  <Input
                    label="End Time"
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    error={errors.endTime}
                  />
                </div>
              </div>

              {/* Location & Capacity */}
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <ApperIcon name="MapPin" size={20} className="text-primary" />
                  Location & Capacity
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    error={errors.location}
                    placeholder="Enter venue address or 'Online'"
                  />
                  
                  <Input
                    label="Maximum Capacity"
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    error={errors.capacity}
                    placeholder="Enter maximum number of attendees"
                    min="1"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/my-events")}
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
                      Creating Event...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Plus" size={16} />
                      Create Event
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateEvent;