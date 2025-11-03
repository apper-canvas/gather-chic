import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const SearchBar = ({ onSearch, placeholder = "Search events...", className = "" }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className={`relative max-w-2xl mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-14 pl-12 pr-24 text-base bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 shadow-sm"
        />
        <Button 
          type="submit"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2"
        >
          Search
        </Button>
      </div>
    </motion.form>
  );
};

export default SearchBar;