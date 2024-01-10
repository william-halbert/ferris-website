import React from "react";
import { useLocation } from "react-router-dom";

export default function Lecture() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const param1 = searchParams.get("c");
  const param2 = searchParams.get("l");
  return (
    <div style={inlineStyles.container}>
      <div style={inlineStyles.header}>Untitled Document</div>
      <div style={inlineStyles.pageContainer}>
        {/* Render pages here. You can map over an array of page data if they are dynamic */}
        <div style={inlineStyles.page}>{/* Page content goes here */}</div>
        {/* Add more pages as needed */}
      </div>
    </div>
  );
}

const inlineStyles = {
  container: {
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#333",
    backgroundColor: "#f8f9fa",
    padding: "20px",
    width: "100%",
    height: "100%",
    overflow: "auto",
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #ddd",
    padding: "10px 20px",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
  },
  pageContainer: {
    marginTop: "20px",
  },
  page: {
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    margin: "0 auto",
    padding: "20px",
    width: "8.5in",
    height: "11in",
    overflowY: "scroll",
    marginBottom: "20px",
  },
};
//get user
//get lecture
//get raw notes
//create google drive UI
