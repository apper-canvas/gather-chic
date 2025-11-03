import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import EventCard from "@/components/molecules/EventCard";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { eventService } from "@/services/api/eventService";
import { registrationService } from "@/services/api/registrationService";
import { toast } from "react-toastify";

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    date: "",
    location: "",
    search: searchParams.get("search") || ""
  });

  const categories = ["Technology", "Business", "Arts", "Sports", "Education", "Community"];

  const loadEvents = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await eventService.getAll();
      setEvents(data);
      applyFilters(data, filters);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (eventList, currentFilters) => {
    let filtered = [...eventList];

    if (currentFilters.search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(currentFilters.search.toLowerCase())
      );
    }

    if (currentFilters.category) {
      filtered = filtered.filter(event =>
        event.category.toLowerCase() === currentFilters.category.toLowerCase()
      );
    }

    if (currentFilters.date) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const monthEnd = new Date(today);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      const quarterEnd = new Date(today);
      quarterEnd.setMonth(quarterEnd.getMonth() + 3);

      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        switch (currentFilters.date) {
          case "today":
            return eventDate >= today && eventDate < tomorrow;
          case "tomorrow":
            return eventDate >= tomorrow && eventDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
          case "week":
            return eventDate >= today && eventDate <= weekEnd;
          case "month":
            return eventDate >= today && eventDate <= monthEnd;
          case "quarter":
            return eventDate >= today && eventDate <= quarterEnd;
          default:
            return true;
        }
      });
    }

    if (currentFilters.location) {
      if (currentFilters.location === "online") {
        filtered = filtered.filter(event =>
          event.location.toLowerCase().includes("online") ||
          event.location.toLowerCase().includes("virtual")
        );
      } else {
        filtered = filtered.filter(event =>
          event.location.toLowerCase().includes(currentFilters.location.replace("-", " "))
        );
      }
    }

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    applyFilters(events, filters);
  }, [filters, events]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.search) params.set("search", newFilters.search);
    setSearchParams(params);
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleClearFilters = () => {
    setFilters({ category: "", date: "", location: "", search: "" });
    setSearchParams({});
  };

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
  if (error) return <Error message={error} onRetry={loadEvents} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Discover Events
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find the perfect event for you
          </p>
          
          <SearchBar 
            onSearch={handleSearch} 
            className="mb-6"
          />
        </motion.div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              categories={categories}
              isOpen={true}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Filter" size={16} />
                Filters
                {(filters.category || filters.date || filters.location) && (
                  <span className="w-2 h-2 bg-primary rounded-full" />
                )}
              </Button>
            </div>

            {/* Results Header */}
            <motion.div
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-gray-600">
                {filteredEvents.length} events found
              </p>
            </motion.div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <Empty
                title="No events found"
                description="Try adjusting your filters or search terms"
                actionText="Clear Filters"
                onAction={handleClearFilters}
                icon="Calendar"
              />
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.Id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                  >
                    <EventCard 
                      event={event} 
                      onRegister={handleRegister}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Filter Sidebar */}
        <div className="lg:hidden">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            categories={categories}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Events;