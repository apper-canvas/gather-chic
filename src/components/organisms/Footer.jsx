import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  const socialLinks = [
    { name: "Twitter", href: "#", icon: "Twitter" },
    { name: "Facebook", href: "#", icon: "Facebook" },
    { name: "Instagram", href: "#", icon: "Instagram" },
    { name: "LinkedIn", href: "#", icon: "Linkedin" }
  ];

  const footerLinks = [
    { name: "About Us", href: "/about" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Contact", href: "#" }
  ];

  return (
    <footer className="bg-secondary text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Gather</span>
            </div>
            <p className="text-gray-300 max-w-sm">
              Connecting communities through amazing events. Discover, create, and join events that matter to you.
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gradient-to-r from-white/10 to-white/5 rounded-lg flex items-center justify-center hover:from-primary/20 hover:to-primary/10 transition-all duration-200 group"
                >
                  <ApperIcon 
                    name={social.icon} 
                    size={20} 
                    className="text-gray-300 group-hover:text-white transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 py-6 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Gather. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;