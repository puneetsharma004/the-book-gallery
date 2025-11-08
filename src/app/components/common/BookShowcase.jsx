"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BookShowcase({
  image,
  size = "md",
  responsiveSize = {},
  blur = false,
  className = "",
}) {
  const sizeMap = {
    xs: { w: 80, h: 113 },
    sm: { w: 120, h: 170 },
    md: { w: 180, h: 255 },
    lg: { w: 240, h: 340 },
    xl: { w: 300, h: 425 },
    "2xl": { w: 360, h: 510 },
    "4xl": { w: 480, h: 680 },
  };

  const getSize = (key) => sizeMap[key] || sizeMap.md;

  // Breakpoints — you can tweak as needed
  const BREAKPOINTS = {
    mobile: 640, // below sm
    tablet: 1024, // below lg
    laptop: 1440, // below xl
  };

  const [currentSize, setCurrentSize] = useState(size);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      let chosenSize =
        width < BREAKPOINTS.mobile
          ? responsiveSize.mobile || size
          : width < BREAKPOINTS.tablet
          ? responsiveSize.tablet || responsiveSize.mobile || size
          : width < BREAKPOINTS.laptop
          ? responsiveSize.laptop ||
            responsiveSize.tablet ||
            responsiveSize.mobile ||
            size
          : responsiveSize.desktop ||
            responsiveSize.laptop ||
            responsiveSize.tablet ||
            responsiveSize.mobile ||
            size;

      setCurrentSize(chosenSize);
    };

    handleResize(); // Initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [responsiveSize, size]);

  const { w, h } = getSize(currentSize);

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
