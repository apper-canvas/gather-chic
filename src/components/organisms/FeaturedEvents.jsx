import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import EventCard from "@/components/molecules/EventCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { eventService } from "@/services/api/eventService";
import { registrationService } from "@/services/api/registrationService";
import { toast } from "react-toastify";

const FeaturedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFeaturedEvents = async () => {
    setLoading(true);
    setError("");
    
    try {
      const allEvents = await eventService.getAll();
      const featuredEvents = allEvents.filter(event => event.isFeatured).slice(0, 3);
      setEvents(featuredEvents);
    } catch (err) {
      setError("Failed to load featured events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await registrationService.create({
        eventId,
        userId: "current-user",
        status: "confirmed"
      });
      toast.success("Successfully registered for the event!");
    } catch (error) {
      toast.error("Failed to register. Please try again.");
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadFeaturedEvents} />;
  if (events.length === 0) return <Empty title="No featured events" description="Check back soon for featured events!" />;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Featured Events
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these handpicked events that promise to deliver exceptional experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {events.map((event, index) => (
            <motion.div
              key={event.Id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <EventCard 
                event={event} 
                onRegister={handleRegister}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Link to="/events">
            <Button variant="outline" size="lg" className="flex items-center gap-2 mx-auto">
              View All Events
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEvents;