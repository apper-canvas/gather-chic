import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { registrationService } from "@/services/api/registrationService";
import { useAuth } from "@/hooks/useAuth";
const RegistrationModal = ({ event, isOpen, onClose, onSuccess, registrationCount = 0 }) => {
  const [isLoading, setIsLoading] = useState(false);

const { user } = useAuth();

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const registration = await registrationService.create({
        eventId: event.Id,
        userId: user?.Id || "current-user",
        userEmail: user?.email || "",
        userName: user?.name || "Event Participant"
      });
      
      if (registration.status === "waitlist") {
        toast.success("Successfully joined the waitlist! You'll be notified if a spot opens up.");
      } else {
        toast.success("Successfully registered for the event!");
      }
      
      onSuccess?.(registration);
      onClose();
    } catch (error) {
      toast.error("Failed to register for the event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
<h3 className="text-xl font-semibold text-secondary">
                  {registrationCount >= event.capacity ? "Join Waitlist" : "Confirm Registration"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-1"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-secondary mb-2">{event.title}</h4>
                  <p className="text-gray-600 text-sm">{event.description}</p>
                </div>

                <div className="space-y-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="Calendar" size={16} className="text-primary" />
                    <span>{format(new Date(event.date), "EEEE, MMMM dd, yyyy")}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="Clock" size={16} className="text-primary" />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="MapPin" size={16} className="text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
<p className="text-sm text-primary font-medium">
                    {registrationCount >= event.capacity ? 
                      "This event is full, but you can join the waitlist. You'll be notified if a spot becomes available." :
                      "You're about to register for this event. You'll receive a confirmation email shortly."
                    }
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
onClick={handleRegister}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      {registrationCount >= event.capacity ? "Joining Waitlist..." : "Registering..."}
                    </div>
                  ) : (
                    registrationCount >= event.capacity ? "Join Waitlist" : "Confirm Registration"
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;