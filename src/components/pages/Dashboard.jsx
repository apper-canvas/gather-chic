import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { eventService } from "@/services/api/eventService";
import { registrationService } from "@/services/api/registrationService";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    registeredEvents: 0,
    createdEvents: 0,
    upcomingEvents: 0
  });
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [allEvents, allRegistrations] = await Promise.all([
        eventService.getAll(),
        registrationService.getAll()
      ]);

      // Mock user-specific data (in real app, this would come from API)
      const userRegistrations = allRegistrations.filter(reg => reg.userId === "current-user");
      const userEvents = allEvents.filter(event => event.organizerId === "current-user");
      const registeredEventIds = userRegistrations.map(reg => reg.eventId);
      const userRegisteredEvents = allEvents.filter(event => registeredEventIds.includes(event.Id));

      const now = new Date();
      const upcomingRegistered = userRegisteredEvents.filter(event => new Date(event.date) > now);
      const upcomingCreated = userEvents.filter(event => new Date(event.date) > now);

      setStats({
        totalEvents: allEvents.length,
        registeredEvents: userRegisteredEvents.length,
        createdEvents: userEvents.length,
        upcomingEvents: upcomingRegistered.length
      });

      setRegisteredEvents(upcomingRegistered.slice(0, 3));
      setCreatedEvents(userEvents.slice(0, 3));
      
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const statCards = [
    {
      title: "Registered Events",
      value: stats.registeredEvents,
      icon: "Calendar",
      color: "from-primary/10 to-primary/20",
      iconColor: "text-primary"
    },
    {
      title: "Created Events", 
      value: stats.createdEvents,
      icon: "Plus",
      color: "from-accent/10 to-accent/20",
      iconColor: "text-accent"
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      icon: "Clock",
      color: "from-success/10 to-success/20",
      iconColor: "text-success"
    },
    {
      title: "Total Platform Events",
      value: stats.totalEvents,
      icon: "TrendingUp",
      color: "from-purple-500/10 to-purple-600/20",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your events
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-secondary">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registered Events */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary">
                  Upcoming Registrations
                </h2>
                <Link to="/events">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    View All
                    <ApperIcon name="ArrowRight" size={16} />
                  </Button>
                </Link>
              </div>

              {registeredEvents.length === 0 ? (
                <Empty
                  title="No upcoming events"
                  description="You haven't registered for any upcoming events yet."
                  actionText="Browse Events"
                  onAction={() => window.location.href = "/events"}
                  icon="Calendar"
                />
              ) : (
                <div className="space-y-4">
                  {registeredEvents.map((event) => (
                    <div key={event.Id} className="flex items-center gap-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ApperIcon name="Calendar" className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-secondary mb-1 truncate">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {format(new Date(event.date), "MMM dd, yyyy")} at {event.startTime}
                        </p>
                        <Badge variant="primary" className="text-xs">
                          {event.category}
                        </Badge>
                      </div>
                      <Link to={`/events/${event.Id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Created Events */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary">
                  Your Events
                </h2>
                <Link to="/my-events">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    View All
                    <ApperIcon name="ArrowRight" size={16} />
                  </Button>
                </Link>
              </div>

              {createdEvents.length === 0 ? (
                <Empty
                  title="No events created"
                  description="You haven't created any events yet. Start by creating your first event!"
                  actionText="Create Event"
                  onAction={() => window.location.href = "/create-event"}
                  icon="Plus"
                />
              ) : (
                <div className="space-y-4">
                  {createdEvents.map((event) => (
                    <div key={event.Id} className="flex items-center gap-4 p-3 bg-gradient-to-r from-accent/5 to-accent/10 rounded-lg">
                      <div className="w-16 h-16 bg-gradient-to-r from-accent/10 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ApperIcon name="Users" className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-secondary mb-1 truncate">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {format(new Date(event.date), "MMM dd, yyyy")} at {event.startTime}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant={event.isFeatured ? "accent" : "default"} className="text-xs">
                            {event.category}
                          </Badge>
                          {event.isFeatured && (
                            <Badge variant="accent" className="text-xs">Featured</Badge>
                          )}
                        </div>
                      </div>
                      <Link to={`/edit-event/${event.Id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="p-8 text-center bg-gradient-to-r from-primary/5 to-accent/5">
            <h3 className="text-2xl font-bold text-secondary mb-4">
              Ready to Create Your Next Event?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Share your passion, knowledge, or hobby with others. Creating an event on Gather is simple and rewarding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create-event">
                <Button size="lg" className="flex items-center gap-2">
                  <ApperIcon name="Plus" size={20} />
                  Create Event
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <ApperIcon name="Search" size={20} />
                  Browse Events
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;