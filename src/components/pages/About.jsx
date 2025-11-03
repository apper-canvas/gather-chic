import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    {
      icon: "Search",
      title: "Discover Events",
      description: "Browse and search through a wide variety of events in your area or online."
    },
    {
      icon: "Calendar",
      title: "Easy Registration", 
      description: "Register for events with just a few clicks and manage your registrations."
    },
    {
      icon: "Users",
      title: "Community Focused",
      description: "Connect with like-minded people and build meaningful relationships."
    },
    {
      icon: "Plus",
      title: "Create Events",
      description: "Organize your own events and reach your target audience effortlessly."
    },
    {
      icon: "BarChart",
      title: "Event Analytics",
      description: "Track your event performance and understand your audience better."
    },
    {
      icon: "Shield",
      title: "Secure Platform",
      description: "Your data and registrations are protected with enterprise-grade security."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Events Created" },
    { number: "50,000+", label: "Happy Users" },
    { number: "500+", label: "Cities Covered" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Gather
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              We're on a mission to bring people together through amazing events. 
              Whether you're looking to discover new experiences or share your passion with others, 
              Gather makes it simple and rewarding.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-secondary mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that meaningful connections happen when people come together around shared interests and experiences. 
                Gather was created to break down the barriers between event organizers and attendees, making it easier than ever 
                to discover, create, and participate in events that matter.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                From intimate workshops to large conferences, from community gatherings to professional networking events, 
                we provide the tools and platform needed to bring your vision to life and connect with your audience.
              </p>
              <Link to="/events">
                <Button size="lg" className="flex items-center gap-2">
                  <ApperIcon name="Calendar" size={20} />
                  Explore Events
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ApperIcon name="Heart" className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-4">
                    Built with Love
                  </h3>
                  <p className="text-gray-600">
                    Every feature is designed to enhance human connection and create memorable experiences.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-white/90">
              See how we're making a difference in communities worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/90 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Why Choose Gather?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to create amazing event experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ApperIcon 
                      name={feature.icon} 
                      className="w-8 h-8 text-primary" 
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join thousands of event organizers and attendees who trust Gather to bring people together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="flex items-center gap-2">
                  <ApperIcon name="UserPlus" size={20} />
                  Get Started Free
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <ApperIcon name="Search" size={20} />
                  Browse Events
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;