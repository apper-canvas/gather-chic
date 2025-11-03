import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { eventService } from "@/services/api/eventService";
import { useAuth } from "@/hooks/useAuth";

const MyEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingEventId, setDeletingEventId] = useState(null);

  const loadMyEvents = async () => {
    setLoading(true);
    setError("");
    
    try {
      const allEvents = await eventService.getAll();
      // In a real app, this would filter by the current user's ID
      // For demo purposes, we'll show some events as user-created
      const userEvents = allEvents.filter((event, index) => index % 3 === 0); // Mock user events
      setEvents(userEvents);
    } catch (err) {
      setError("Failed to load your events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyEvents();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    setDeletingEventId(eventId);
    
    try {
      await eventService.delete(eventId);
      setEvents(prev => prev.filter(event => event.Id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error("Failed to delete event");
    } finally {
      setDeletingEventId(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadMyEvents} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">
              My Events
            </h1>
            <p className="text-gray-600">
              Manage all the events you've created
            </p>
          </div>
          
          <Link to="/create-event">
            <Button size="lg" className="flex items-center gap-2 mt-4 sm:mt-0">
              <ApperIcon name="Plus" size={20} />
              Create Event
            </Button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Events
                  </p>
                  <p className="text-3xl font-bold text-secondary">
                    {events.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Calendar" className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Upcoming
                  </p>
                  <p className="text-3xl font-bold text-success">
                    {events.filter(event => new Date(event.date) > new Date()).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-success/10 to-success/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Clock" className="w-6 h-6 text-success" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Featured
                  </p>
                  <p className="text-3xl font-bold text-accent">
                    {events.filter(event => event.isFeatured).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-accent/10 to-accent/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Star" className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Empty
              title="No events created yet"
              description="Start by creating your first event and sharing it with the community!"
              actionText="Create Your First Event"
              onAction={() => window.location.href = "/create-event"}
              icon="Plus"
            />
          </motion.div>
        ) : (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {events.map((event, index) => {
              const eventDate = new Date(event.date);
              const isUpcoming = eventDate > new Date();
              const isPast = eventDate < new Date();
              
              return (
                <motion.div
                  key={event.Id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className={`p-6 ${isPast ? "opacity-75" : ""}`}>
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Event Image */}
                      <div className="w-full lg:w-48 h-32 lg:h-24 flex-shrink-0">
                        <img
                          src={event.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400"}
                          alt={event.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Event Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge variant={event.isFeatured ? "accent" : "primary"}>
                                {event.category}
                              </Badge>
                              {event.isFeatured && (
                                <Badge variant="accent">Featured</Badge>
                              )}
                              {isPast && (
                                <Badge variant="default">Completed</Badge>
                              )}
                            </div>
                            
                            <h3 className="text-xl font-semibold text-secondary mb-2">
                              {event.title}
                            </h3>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {event.description}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <ApperIcon name="Calendar" size={16} className="text-primary" />
                                <span>{format(eventDate, "MMM dd, yyyy")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ApperIcon name="Clock" size={16} className="text-primary" />
                                <span>{event.startTime} - {event.endTime}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ApperIcon name="MapPin" size={16} className="text-primary" />
                                <span className="truncate">{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ApperIcon name="Users" size={16} className="text-primary" />
                                <span>{event.capacity} capacity</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 min-w-[120px]">
                            <Link to={`/events/${event.Id}`}>
                              <Button variant="outline" size="sm" className="w-full">
                                <ApperIcon name="Eye" size={16} className="mr-2" />
                                View
                              </Button>
                            </Link>
                            
                            {isUpcoming && (
                              <Link to={`/edit-event/${event.Id}`}>
                                <Button variant="outline" size="sm" className="w-full">
                                  <ApperIcon name="Edit" size={16} className="mr-2" />
                                  Edit
                                </Button>
                              </Link>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.Id)}
                              disabled={deletingEventId === event.Id}
                              className="w-full text-error hover:text-error border-error/30 hover:border-error"
                            >
                              {deletingEventId === event.Id ? (
                                <motion.div
                                  className="w-4 h-4 border-2 border-error border-t-transparent rounded-full mr-2"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                              ) : (
                                <ApperIcon name="Trash2" size={16} className="mr-2" />
                              )}
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;