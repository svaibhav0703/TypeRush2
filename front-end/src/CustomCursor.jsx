import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTypingArea, setIsTypingArea] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  useEffect(() => {
    const typingArea = document.getElementById("typing-area");

    if (typingArea) {
      typingArea.addEventListener("mouseenter", () => setIsTypingArea(true));
      typingArea.addEventListener("mouseleave", () => setIsTypingArea(false));
    }

    return () => {
      if (typingArea) {
        typingArea.removeEventListener("mouseenter", () =>
          setIsTypingArea(true)
        );
        typingArea.removeEventListener("mouseleave", () =>
          setIsTypingArea(false)
        );
      }
    };
  }, []);

  return (
    <motion.div
      animate={{
        x: position.x - 10,
        y: position.y - 10,
        scale: isTypingArea ? 0.5 : 1,
        backgroundColor: isTypingArea ? "#22c55e" : "rgba(255,255,255,0.7)",
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "difference",
      }}
    />
  );
};

export default CustomCursor;
