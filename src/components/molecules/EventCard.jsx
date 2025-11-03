import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const EventCard = ({ event, onRegister, isRegistered = false, showRegisterButton = true, registrationCount = 0 }) => {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400"}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <Badge variant={event.isFeatured ? "accent" : "primary"}>
              {event.category}
            </Badge>
          </div>
          {event.isFeatured && (
            <div className="absolute top-4 right-4">
              <Badge variant="accent">Featured</Badge>
            </div>
          )}
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg text-secondary mb-2 line-clamp-2">
            {event.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {event.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Calendar" size={16} className="text-primary" />
              <span>{format(eventDate, "MMM dd, yyyy")}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Clock" size={16} className="text-primary" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="MapPin" size={16} className="text-primary" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            
<div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Users" size={16} className="text-primary" />
              <span>
                {registrationCount >= event.capacity ? (
                  <span className="text-accent font-semibold">Full</span>
                ) : (
                  `${event.capacity - registrationCount} spots available`
                )}
              </span>
              {registrationCount >= event.capacity && (
                <Badge variant="destructive" className="text-xs px-2 py-0.5">
                  FULL
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Link to={`/events/${event.Id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            
{showRegisterButton && isUpcoming && (
              <Button
                size="sm"
                variant={isRegistered ? "secondary" : "primary"}
                onClick={() => onRegister && onRegister(event.Id)}
                className="flex-shrink-0"
              >
                {isRegistered ? "Registered" : 
                 registrationCount >= event.capacity ? "Join Waitlist" : "Register"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default EventCard;