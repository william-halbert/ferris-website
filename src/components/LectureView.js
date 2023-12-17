import React, { useState, useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";
import { getAuth } from "firebase/auth";
export default function LectureView({ lecture, goBack, notebook, color }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [animating, setAnimating] = useState({ left: false, right: false });

  const hexToRGBA = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const inlineStyles = {
    lectureContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "20px",
    },
    backButton: {
      cursor: "pointer",
      border: "none",
      //transform: "rotate(-90deg) translateY(-110px) translateX(-50%)",
      position: "absolute",
      background: color,
      borderRadius: "10px 10px 0 0",
      top: "-60px", // Center vertically
      left: "40px", // Adjust 60px based on your needs
      padding: "10px 20px",
      fontSize: "32px",

      zIndex: 10, // Ensure it's above other elements
    },
    book: {
      position: "relative", // Relative position for the backButton
      display: "flex",
      justifyContent: "space-between",
      maxWidth: "1200px",
      margin: "0 auto",
      background: hexToRGBA(color, 0.3),
      borderRadius: "10px",
      textAlign: "left",
    },
    lectureContent: {
      width: "600px",
      padding: "20px",
      margin: "0 auto",
      textAlign: "left",
    },
    navigationButton: {
      cursor: "pointer",
      padding: "10px",
      margin: "5px",
      fontSize: "24px",
      border: "none",
      background: "none",
    },

    leftPage: {
      // Styles for the left page
      width: "600px",
      padding: "20px 20px 40px 20px",
      border: "2px solid 0",
      borderRadius: "10px",
      minHeight: "300px",
      background: hexToRGBA(color, 0.3),
      boxShadow: "0 4px 5px rgba(0,0,0,0.2)",
      transformOrigin: "right center", // Pivot from the right center
      transform: animating.left
        ? "rotateY(-180deg) scale(0.9)"
        : "rotateY(0deg) scale(1)",
      opacity: animating.left ? 0 : 1,
      transition: "transform 0.3s ease-in-out",
    },
    rightPage: {
      // Styles for the right page
      width: "600px",
      padding: "20px 20px 40px 20px",
      border: "2px solid 0",
      borderRadius: "10px",
      minHeight: "300px",
      background: hexToRGBA(color, 0.3),
      boxShadow: "0 4px 5px rgba(0,0,0,0.2)",
      transformOrigin: "left center", // Pivot from the left center
      transform: animating.right
        ? "rotateY(180deg) scale(0.9)"
        : "rotateY(0deg) scale(1)",
      opacity: animating.right ? 0 : 1,
      transition: "transform 0.3s ease-in-out",
    },
    pageContent: {
      minHeight: "260px", // Adjust as needed
    },
    pageNumber: {
      position: "absolute", // Position the element absolutely within its parent container
      bottom: "20px", // Position from the bottom
      left: "50%", // Center horizontally
      transform: "translateX(-50%)", // Adjust for centering
      textAlign: "center",
      width: "100%", // Ensure it spans the width of the page
    },
  };

  const notes = [
    ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel
    felis non nisi congue tincidunt. Phasellus fermentum, mauris eu auctor
    hendrerit, velit nulla tristique nisi, eu cursus ex urna vel dui.
    Vivamus gravida lorem sit amet odio bibendum, eget interdum neque
    congue. Curabitur in orci a lectus euismod luctus. In hac habitasse
    platea dictumst. Integer venenatis, ex in consectetur lacinia, justo
    tellus blandit massa, in consectetur dolor est eget urna. Nulla
    facilisi.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel
    felis non nisi congue tincidunt. Phasellus fermentum, mauris eu auctor
    hendrerit, velit nulla tristique nisi, eu cursus ex urna vel dui.
    Vivamus gravida lorem sit amet odio bibendum, eget interdum neque
    congue. Curabitur in orci a lectus euismod luctus. In hac habitasse
    platea dictumst. Integer venenatis, ex in consectetur lacinia, justo
    tellus blandit massa, in consectetur dolor est eget urna. Nulla
    facilisi.`,
    ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel
    felis non nisi congue tincidunt. Phasellus fermentum, mauris eu auctor
    hendrerit, velit nulla tristique nisi, eu cursus ex urna vel dui.
    Vivamus gravida lorem sit amet odio bibendum, eget interdum neque
    congue. Curabitur in orci a lectus euismod luctus. In hac habitasse
    platea dictumst. Integer venenatis, ex in consectetur lacinia, justo
    tellus blandit massa, in consectetur dolor est eget urna. Nulla
    facilisi.`,
    ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel
    felis non nisi congue tincidunt. Phasellus fermentum, mauris eu auctor
    hendrerit, velit nulla tristique nisi, eu cursus ex urna vel dui.
    Vivamus gravida lorem sit amet odio bibendum, eget interdum neque
    congue. Curabitur in orci a lectus euismod luctus. In hac habitasse
    platea dictumst. Integer venenatis, ex in consectetur lacinia, justo
    tellus blandit massa, in consectetur dolor est eget urna. Nulla
    facilisi.`,
    ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel
    felis non nisi congue tincidunt. Phasellus fermentum, mauris eu auctor
    hendrerit, velit nulla tristique nisi, eu cursus ex urna vel dui.
    Vivamus gravida lorem sit amet odio bibendum, eget interdum neque
    congue. Curabitur in orci a lectus euismod luctus. In hac habitasse
    platea dictumst. Integer venenatis, ex in consectetur lacinia, justo
    tellus blandit massa, in consectetur dolor est eget urna. Nulla
    facilisi.`,
    ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel
    felis non nisi congue tincidunt. Phasellus fermentum, mauris eu auctor
    hendrerit, velit nulla tristique nisi, eu cursus ex urna vel dui.
    Vivamus gravida lorem sit amet odio bibendum, eget interdum neque
    congue. Curabitur in orci a lectus euismod luctus. In hac habitasse
    platea dictumst. Integer venenatis, ex in consectetur lacinia, justo
    tellus blandit massa, in consectetur dolor est eget urna. Nulla
    facilisi.`,
    ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel
    felis non nisi congue tincidunt. Phasellus fermentum, mauris eu auctor
    hendrerit, velit nulla tristique nisi, eu cursus ex urna vel dui.
    Vivamus gravida lorem sit amet odio bibendum, eget interdum neque
    congue. Curabitur in orci a lectus euismod luctus. In hac habitasse
    platea dictumst. Integer venenatis, ex in consectetur lacinia, justo
    tellus blandit massa, in consectetur dolor est eget urna. Nulla
    facilisi.`,
    ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel
    felis non nisi congue tincidunt. Phasellus fermentum, mauris eu auctor
    hendrerit, velit nulla tristique nisi, eu cursus ex urna vel dui.
    Vivamus gravida lorem sit amet odio bibendum, eget interdum neque
    congue. Curabitur in orci a lectus euismod luctus. In hac habitasse
    platea dictumst. Integer venenatis, ex in consectetur lacinia, justo
    tellus blandit massa, in consectetur dolor est eget urna. Nulla
    facilisi.`,
  ];

  // Functions to navigate pages

  const goToNextPage = () => {
    if (currentPage < notes.length - 2 && !animating.right) {
      setAnimating({ ...animating, left: true });
      setTimeout(() => {
        setCurrentPage(currentPage + 2);
        setAnimating({ ...animating, left: false });
      }, 300); // Adjust timing as needed
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0 && !animating.left) {
      setAnimating({ ...animating, right: true });
      setTimeout(() => {
        setCurrentPage(currentPage - 2);
        setAnimating({ ...animating, right: false });
      }, 300); // Adjust timing as needed
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      goToNextPage();
    } else if (event.key === "ArrowLeft") {
      goToPreviousPage();
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage, notes.length]);

  return (
    <div style={inlineStyles.lectureContainer}>
      <div style={inlineStyles.book}>
        <button style={inlineStyles.backButton} onClick={goBack}>
          {notebook}
        </button>
        <div style={inlineStyles.leftPage}>
          <div style={inlineStyles.pageContent}>
            <h2> {lecture}</h2>
            <p>{notes[currentPage]}</p>
          </div>
          <div style={inlineStyles.pageNumber}>{currentPage + 1}</div>
        </div>
        {currentPage + 1 < notes.length && ( // Check if there's a next page
          <div style={inlineStyles.rightPage}>
            <div style={inlineStyles.pageContent}>
              <h2 style={{ opacity: "0" }}> nn</h2>
              <p>{notes[currentPage + 1]}</p>
            </div>
            <div style={inlineStyles.pageNumber}>{currentPage + 2}</div>
          </div>
        )}
      </div>
      <div>
        {currentPage > 0 && (
          <button
            style={inlineStyles.navigationButton}
            onClick={goToPreviousPage}
          >
            ←
          </button>
        )}
        {currentPage + 2 < notes.length && (
          <button style={inlineStyles.navigationButton} onClick={goToNextPage}>
            →
          </button>
        )}
      </div>
    </div>
  );
}
