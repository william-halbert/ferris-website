import React, { useState, useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";
import { getAuth } from "firebase/auth";
import LectureView from "./LectureView";

export default function NotebookContent({ notebook, goBack }) {
  const [selectedLecture, setSelectedLecture] = useState(null);
  const { color } = notebook;
  const hexToRGBA = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const goBackToLectures = () => {
    setSelectedLecture(null);
  };
  if (selectedLecture) {
    return (
      <LectureView
        notebook={notebook.name}
        lecture={selectedLecture}
        goBack={goBackToLectures}
        color={color}
      />
    );
  }
  const inlineStyles = {
    contentContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
      position: "relative", // to position the backButton absolutely within this container
    },
    backButton: {
      cursor: "pointer",
      position: "absolute",
      top: "20px",
      left: "20px",
      padding: "5px 10px",
      fontSize: "16px",
    },
    book: {
      width: "80vw",
      transform: "rotate(0deg)",
      display: "flex",
    },
    lectureGrid: {
      // New style for the grid layout
      display: "grid",
      gridTemplateColumns: "1fr 1fr", // Two columns
      gap: "10px", // Space between grid items
    },
    page: {
      width: "50%",
      padding: "20px",
      borderRadius: "10px",
      border: `none`,
      boxShadow: "0 4px 5px rgba(0,0,0,0.2)",

      background: hexToRGBA(color, 0.8), // Reduced opacity
      textAlign: "center",
      overflowY: "auto", // make the page scrollable
      minHeight: "300px", // minimum height to maintain the book look when content is le
    },
    leftPage: {
      borderRight: "0px solid #ddd",
    },
    rightPage: {},
    lectureItem: {
      padding: "5px",
      borderBottom: "2px solid grey",
      cursor: "pointer",
      fontSize: "20px",
    },
  };

  return (
    <div style={inlineStyles.contentContainer}>
      <div style={inlineStyles.book}>
        <div style={{ ...inlineStyles.page, ...inlineStyles.leftPage }}>
          <h2 style={{ fontSize: "40px" }}>{notebook.name}</h2>
        </div>
        <div style={{ ...inlineStyles.page, ...inlineStyles.rightPage }}>
          <div style={inlineStyles.lectureGrid}>
            {notebook.content &&
              notebook.content.map((lecture, index) => (
                <div
                  key={index}
                  style={inlineStyles.lectureItem}
                  onClick={() => setSelectedLecture(lecture)}
                >
                  {lecture}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
