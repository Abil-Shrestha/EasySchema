"use client";

import {motion} from "framer-motion";
import {useEffect, useState} from "react";

const asciiFrames = ["|", "/", "-", "\\"];

export default function Loader() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % asciiFrames.length);
    }, 150); // Change frame every 150ms

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="">
      <motion.div
        className="text-2xl font-mono"
        animate={{
          opacity: [1, 0.5, 1],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        {asciiFrames[frame]}
      </motion.div>
    </div>
  );
}
