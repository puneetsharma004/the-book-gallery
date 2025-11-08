"use client";
import React from "react";
import { motion } from "framer-motion";

export default function BookShowcase({
  image,
  size = "md",
  blur = false,
  className = "",
}) {
  const sizeMap = {
    sm: { w: 120, h: 170 },
    md: { w: 180, h: 255 },
    lg: { w: 240, h: 340 },
  };

  const { w, h } = sizeMap[size] || sizeMap.md;

  return (
    <motion.div
      className={`relative rounded-r-md overflow-hidden bg-white group ${
        blur ? "blur-xs" : ""
      } ${className}`}
      style={{
        width: `${w}px`,
        height: `${h}px`,
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transformOrigin: "left center",
      }}
      whileHover={{
        rotateY: -28,
        rotateZ: -2,
        scale: 1.02,
        boxShadow:
          "2px 4px 6px rgba(0,0,0,0.15), 12px 6px 0 rgba(255,255,255,0.8)",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Light reflection layer */}
      <motion.div
        className="absolute inset-0 opacity-0 bg-gradient-to-b from-white/20 to-transparent"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      />
    </motion.div>
  );
}
