import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";

const FilterSidebar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  categories = [],
  isOpen = true,
  onClose 
}) => {
  const handleCategoryChange = (e) => {
    onFilterChange({ ...filters, category: e.target.value });
  };

  const handleDateChange = (e) => {
    onFilterChange({ ...filters, date: e.target.value });
  };

  const handleLocationChange = (e) => {
    onFilterChange({ ...filters, location: e.target.value });
  };

  const hasActiveFilters = filters.category || filters.date || filters.location;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      <motion.div
        className={`
          fixed lg:sticky lg:top-6 left-0 top-0 h-full lg:h-auto w-80 lg:w-full max-w-sm
          bg-surface rounded-none lg:rounded-xl border-r lg:border border-gray-200 
          shadow-lg lg:shadow-sm z-50 lg:z-0 overflow-y-auto
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        initial={false}
        animate={isOpen ? { x: 0 } : { x: -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
              <ApperIcon name="Filter" size={20} className="text-primary" />
              Filters
            </h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-accent hover:text-accent/80"
                >
                  Clear All
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden p-1"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Select
                label="Category"
                value={filters.category || ""}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </div>

            <div>
              <Select
                label="Date Range"
                value={filters.date || ""}
                onChange={handleDateChange}
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">Next 3 Months</option>
              </Select>
            </div>

            <div>
              <Select
                label="Location"
                value={filters.location || ""}
                onChange={handleLocationChange}
              >
                <option value="">All Locations</option>
                <option value="online">Online</option>
                <option value="new-york">New York</option>
                <option value="san-francisco">San Francisco</option>
                <option value="los-angeles">Los Angeles</option>
                <option value="chicago">Chicago</option>
                <option value="austin">Austin</option>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <motion.div
              className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-primary font-medium mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {filters.category && (
                  <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                    {filters.category}
                  </span>
                )}
                {filters.date && (
                  <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                    {filters.date}
                  </span>
                )}
                {filters.location && (
                  <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                    {filters.location}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default FilterSidebar;