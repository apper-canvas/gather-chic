import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import UserMenu from "@/components/molecules/UserMenu";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const publicNavItems = [
    { label: "Home", href: "/", icon: "Home" },
    { label: "Events", href: "/events", icon: "Calendar" },
    { label: "About", href: "/about", icon: "Info" }
  ];

  const privateNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "My Events", href: "/my-events", icon: "Calendar" },
  ];

  const allNavItems = isAuthenticated 
    ? [...publicNavItems, ...privateNavItems]
    : publicNavItems;

  const isActive = (href) => location.pathname === href;

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">
              Gather
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {allNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-secondary"
                }`}
              >
                <ApperIcon name={item.icon} size={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/create-event" className="hidden sm:block">
                  <Button size="sm" className="flex items-center gap-2">
                    <ApperIcon name="Plus" size={16} />
                    Create Event
                  </Button>
                </Link>
                <UserMenu />
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              <ApperIcon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                size={20} 
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 bg-surface"
          >
            <div className="px-4 py-4 space-y-2">
              {allNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50"
                  }`}
                >
                  <ApperIcon name={item.icon} size={16} />
                  {item.label}
                </Link>
              ))}

              {isAuthenticated && (
                <Link
                  to="/create-event"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 transition-colors"
                >
                  <ApperIcon name="Plus" size={16} />
                  Create Event
                </Link>
              )}

              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-secondary"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;