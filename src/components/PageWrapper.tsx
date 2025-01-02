import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`${!isHome ? "sm:pt-12 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 " : ""}`}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
