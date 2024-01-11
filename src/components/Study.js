import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import BackpackImg from "../images/backpackBlue.png";
import UnzippedImg from "../images/unzippedBackpackBlue.png";
import { motion } from "framer-motion";
import ListOfNotebooks from "./ListOfNotebooks";

export default function Study() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [needsAnimating, setNeedsAnimating] = useState(false); // Renamed for clarity
  const [isAnimating, setIsAnimating] = useState(true);
  const [showNotebooks, setShowNotebooks] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }

    if (needsAnimating) {
      const timeoutId = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);

      const notebookTimeoutId = setTimeout(() => {
        setShowNotebooks(true);
      }, 3500);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(notebookTimeoutId);
      };
    } else {
      setShowNotebooks(true);
    }
  }, [user, navigate, needsAnimating]);

  useEffect(() => {
    if (location.state?.from === "/auth") {
      setNeedsAnimating(true);
    }
  }, [location, navigate]);

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
    <>
      {needsAnimating && !showNotebooks ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <motion.img
            src={isAnimating ? BackpackImg : UnzippedImg}
            alt="Backpack"
            initial="centered"
            animate={isAnimating ? "centered" : "topLeft"}
            variants={backpackVariants}
            style={{ maxWidth: "80vw", maxHeight: "80vh" }}
          />
        </div>
      ) : showNotebooks ? (
        <ListOfNotebooks />
      ) : null}
    </>
  );
}
