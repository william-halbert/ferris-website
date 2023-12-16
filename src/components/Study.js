import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import BackpackImg from "../images/backpackBlue.png";
import UnzippedImg from "../images/unzippedBackpackBlue.png";
import { motion } from "framer-motion";

export default function Study() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [needsAnimating, setNeedsAnimating] = useState(true); // Renamed for clarity
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }

    // Start the animation 1 second after the component mounts if needed
    if (needsAnimating) {
      const timeoutId = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);

      // Clean up the timeout when the component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [user, navigate, needsAnimating]);

  const backpackVariants = {
    centered: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1 },
    },
    topLeft: {
      width: "150px",
      height: "150px",
      opacity: 1,
      scale: 1,
      transition: { duration: 2 },
      position: "fixed",
      top: "16px",
      left: "16px",
    },
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      {needsAnimating ? (
        <motion.img
          src={isAnimating ? BackpackImg : UnzippedImg}
          alt="Backpack"
          initial="centered"
          animate={isAnimating ? "centered" : "topLeft"}
          variants={backpackVariants}
          style={{ maxWidth: "80vw", maxHeight: "80vh" }}
        />
      ) : (
        <img
          src={UnzippedImg}
          alt="Unzipped Backpack"
          style={{
            position: "fixed",
            top: "16px",
            left: "16px",
            width: "150px",
            height: "150px",
          }}
        />
      )}
    </div>
  );
}
