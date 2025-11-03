import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const EventCategories = () => {
  const categories = [
    {
      name: "Technology",
      icon: "Laptop",
      color: "from-blue-500/10 to-blue-600/20",
      iconColor: "text-blue-600",
      description: "Tech talks, hackathons, and innovation"
    },
    {
      name: "Business",
      icon: "Briefcase", 
      color: "from-emerald-500/10 to-emerald-600/20",
      iconColor: "text-emerald-600",
      description: "Networking, conferences, and growth"
    },
    {
      name: "Arts",
      icon: "Palette",
      color: "from-purple-500/10 to-purple-600/20", 
      iconColor: "text-purple-600",
      description: "Exhibitions, workshops, and creativity"
    },
    {
      name: "Sports",
      icon: "Trophy",
      color: "from-orange-500/10 to-orange-600/20",
      iconColor: "text-orange-600", 
      description: "Competitions, fitness, and wellness"
    },
    {
      name: "Education",
      icon: "GraduationCap",
      color: "from-indigo-500/10 to-indigo-600/20",
      iconColor: "text-indigo-600",
      description: "Courses, seminars, and learning"
    },
    {
      name: "Community",
      icon: "Users",
      color: "from-pink-500/10 to-pink-600/20",
      iconColor: "text-pink-600", 
      description: "Social gatherings and volunteering"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Explore Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find events that match your interests and passions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={`/events?category=${category.name.toLowerCase()}`}>
                <Card className="p-6 text-center group cursor-pointer">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <ApperIcon 
                      name={category.icon} 
                      className={`w-8 h-8 ${category.iconColor}`} 
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCategories;