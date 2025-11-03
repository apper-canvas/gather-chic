import { motion } from "framer-motion";

const Loading = ({ type = "cards" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className="bg-surface rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            <div className="p-6">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-3" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-2 w-3/4" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-4 w-1/2" />
              <div className="flex justify-between items-center">
                <div className="h-8 w-20 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full animate-pulse" />
                <div className="h-8 w-24 bg-gradient-to-r from-accent/20 to-accent/40 rounded animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "page") {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-surface rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
          <div className="p-8">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-4" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-3 w-3/4" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-6 w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-gradient-to-r from-primary/20 to-primary/40 rounded animate-pulse" />
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse flex-1" />
                </div>
              ))}
            </div>
            <div className="h-12 w-40 bg-gradient-to-r from-primary/40 to-primary/60 rounded-lg animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;