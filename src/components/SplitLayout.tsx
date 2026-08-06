import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router";

interface SplitLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftImageUrl?: string;
  leftBackground?: React.ReactNode;
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({ leftContent, rightContent, leftImageUrl, leftBackground }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Left side (Visuals) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {leftImageUrl ? (
            <motion.div
              key={leftImageUrl}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${leftImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
            </motion.div>
          ) : leftBackground ? (
             <motion.div
                key="custom-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 z-0"
             >
                {leftBackground}
             </motion.div>
          ) : (
             <motion.div
                key="empty-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 z-0 bg-slate-900"
             />
          )}
        </AnimatePresence>

        <div className="relative z-10 flex flex-col justify-end p-12 h-full w-full pointer-events-none">
          <motion.div
            key={`content-${location.pathname}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {leftContent}
          </motion.div>
        </div>
      </div>

      {/* Right side (Forms) */}
      <div className="flex flex-col w-full lg:w-1/2 relative">
        <div className="absolute top-4 right-6 lg:top-8 lg:right-12 z-20">
          <ThemeToggle />
        </div>
        
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-24 py-12 lg:py-0 overflow-y-auto overflow-x-hidden">
           {rightContent}
        </div>
      </div>
    </div>
  );
};