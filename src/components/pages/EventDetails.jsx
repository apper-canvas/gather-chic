import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { eventService } from "@/services/api/eventService";
import { registrationService } from "@/services/api/registrationService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import About from "@/components/pages/About";
import Home from "@/components/pages/Home";
import Events from "@/components/pages/Events";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import RegistrationModal from "@/components/molecules/RegistrationModal";
import { useAuth } from "@/hooks/useAuth";

const EventDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRegistration, setUserRegistration] = useState(null);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const loadEvent = async () => {
    setLoading(true);
    setError("");
    
try {
      const eventData = await eventService.getById(parseInt(id));
      setEvent(eventData);
      
      // Load registration counts
      const confirmedCount = await registrationService.getRegistrationCountForEvent(eventData.Id);
      const waitlistCount = await registrationService.getWaitlistCountForEvent(eventData.Id);
      setRegistrationCount(confirmedCount);
      setWaitlistCount(waitlistCount);
      
      // Check if current user is registered
      const userReg = await registrationService.getUserRegistrationForEvent(eventData.Id, "current-user");
      setUserRegistration(userReg);
      setIsRegistered(!!userReg);
      
      // Load related events
      const allEvents = await eventService.getAll();
      const related = allEvents
        .filter(e => e.Id !== eventData.Id && e.category === eventData.category)
        .slice(0, 3);
      setRelatedEvents(related);
      
    } catch (err) {
      setError("Event not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

const handleRegisterClick = () => {
    if (isRegistered) return;
    if (!isAuthenticated) {
      toast.info("Please sign in to register for events");
      return;
    }
    setShowRegistrationModal(true);
  };

const handleRegistrationSuccess = async (registration) => {
    setIsRegistered(true);
    setUserRegistration(registration);
    setShowRegistrationModal(false);
    
    // Refresh counts
    const confirmedCount = await registrationService.getRegistrationCountForEvent(event.Id);
    const waitlistCount = await registrationService.getWaitlistCountForEvent(event.Id);
    setRegistrationCount(confirmedCount);
    setWaitlistCount(waitlistCount);
  };

  if (loading) return <Loading type="page" />;
  if (error) return <Error message={error} />;
  if (!event) return <Error message="Event not found" />;

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.nav
          className="flex items-center gap-2 text-sm text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ApperIcon name="ChevronRight" size={16} />
          <Link to="/events" className="hover:text-primary transition-colors">
            Events
          </Link>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-secondary">{event.title}</span>
        </motion.nav>

        {/* Event Header */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative h-64 lg:h-80">
                <img
                  src={event.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant={event.isFeatured ? "accent" : "primary"}>
                    {event.category}
                  </Badge>
                  {event.isFeatured && (
                    <Badge variant="accent">Featured</Badge>
                  )}
                </div>
              </div>

              <div className="p-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
                  {event.title}
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <ApperIcon name="Calendar" size={20} className="text-primary" />
                    <span>{format(eventDate, "EEEE, MMMM dd, yyyy")}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <ApperIcon name="Clock" size={20} className="text-primary" />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <ApperIcon name="MapPin" size={20} className="text-primary" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
<ApperIcon name="Users" size={20} className="text-primary" />
                    <span>
                      {registrationCount >= event.capacity ? (
                        <span className="text-accent font-semibold">Event Full</span>
                      ) : (
                        `${event.capacity - registrationCount} of ${event.capacity} spots available`
                      )}
                    </span>
                  </div>
{waitlistCount > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ApperIcon name="Clock" size={20} className="text-warning" />
                      <span>{waitlistCount} on waitlist</span>
                    </div>
                  )}
                  {userRegistration?.status === "waitlist" && (
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-warning font-medium">
                        <ApperIcon name="Clock" size={16} />
                        <span>You're on the waitlist</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-secondary mb-4">About This Event</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Registration Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  {isUpcoming ? "Register Now" : "Event Completed"}
                </h3>
                {isUpcoming && (
                  <p className="text-gray-600 text-sm">
                    Secure your spot at this amazing event
                  </p>
                )}
              </div>

{isUpcoming ? (
                <div className="space-y-4">
                  <Button
                    onClick={handleRegisterClick}
                    className="w-full py-4"
                    size="lg"
                    disabled={isRegistered}
                  >
                    {isRegistered ? (
                      userRegistration?.status === "waitlist" ? (
                        <>
                          <ApperIcon name="Clock" size={16} className="mr-2" />
                          On Waitlist
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Check" size={16} className="mr-2" />
                          Registered
                        </>
                      )
                    ) : registrationCount >= event.capacity ? (
                      <>
                        <ApperIcon name="Clock" size={16} className="mr-2" />
                        Join Waitlist
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Calendar" size={16} className="mr-2" />
                        Register for Event
                      </>
                    )}
                  </Button>

                  {!isAuthenticated && (
                    <p className="text-xs text-center text-gray-500">
                      <Link to="/login" className="text-primary hover:underline">
                        Sign in
                      </Link>{" "}
                      required to register
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Calendar" size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">This event has ended</p>
                </div>
              )}

              {/* Event Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
<div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{event.capacity}</div>
                    <div className="text-xs text-gray-500">Capacity</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">{registrationCount}</div>
                    <div className="text-xs text-gray-500">Registered</div>
                  </div>
                </div>
                {waitlistCount > 0 && (
                  <div className="text-center mt-4">
                    <div className="text-lg font-bold text-warning">{waitlistCount}</div>
                    <div className="text-xs text-gray-500">On Waitlist</div>
                  </div>
                )}
              </div>

              {/* Organizer Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-secondary mb-3">Organized by</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">JD</span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary">Jane Doe</p>
                    <p className="text-xs text-gray-500">Event Organizer</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <motion.section
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-secondary mb-8">
              Related Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <Card key={relatedEvent.Id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="h-32 overflow-hidden">
                    <img
                      src={relatedEvent.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400"}
                      alt={relatedEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-secondary mb-2 line-clamp-2">
                      {relatedEvent.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <ApperIcon name="Calendar" size={14} />
                      <span>{format(new Date(relatedEvent.date), "MMM dd")}</span>
                    </div>
                    <Link to={`/events/${relatedEvent.Id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Registration Modal */}
<RegistrationModal
        event={event}
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={handleRegistrationSuccess}
        registrationCount={registrationCount}
      />
    </div>
  );
};

export default EventDetails;