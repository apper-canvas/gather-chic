import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const HeroSection = ({ onSearch, onBrowseEvents, onCreateEvent }) => {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-secondary mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Discover Amazing{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Events
            </span>
          </motion.h1>
          
          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Connect with your community, learn something new, and create unforgettable memories. 
            Find events that inspire you or create your own.
          </motion.p>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SearchBar 
              onSearch={onSearch} 
              placeholder="Search for events, topics, or locations..."
            />
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
<Button size="lg" className="flex items-center gap-2" onClick={onBrowseEvents}>
              <ApperIcon name="Search" size={20} />
              Browse Events
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2" onClick={onCreateEvent}>
              <ApperIcon name="Plus" size={20} />
              Create Event
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-accent/10 to-transparent rounded-full blur-3xl" />
    </section>
  );
};

export default HeroSection;