"use client";
import { motion } from "framer-motion";

// Fade up on enter — use for cards, sections
export const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Stagger children — wrap lists of cards
export const StaggerContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial="hidden"
    animate="show"
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: 0.1 } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Each stagger child
export const StaggerItem = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Scale on hover — wrap buttons and interactive cards
export const ScaleOnHover = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide in from left — use for sidebar or nav
export const SlideInLeft = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ x: -40, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);
