import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAuth } from "firebase/auth";

export default function Lecture() {
  const location = useLocation();
  const [lectureNameDisplay, setLectureNameDisplay] = useState("");
  const [abbrevDateDisplay, setAbbrevDateDisplay] = useState("");
  const {} = useAuth();
  const auth = getAuth();
  const [rawNotes, setRawNotes] = useState(null);
  const [rawNotesId, setRawNotesId] = useState("");
  const { getRawNotes, getLecture } = useAuth();
  const user = auth.currentUser;
  const searchParams = new URLSearchParams(location.search);
  const classId = searchParams.get("c");
  const lectureId = searchParams.get("l");

  const [pages, setPages] = useState([]); // State to hold pages
  const contentRef = useRef(null); // Ref to measure content height
  const PAGE_HEIGHT = 11.5 * 96; // 11.5 inches in pixels (assuming 96 DPI)

  useEffect(() => {
    const fetchNotes = async (rawNotesIdFxn) => {
      if (user) {
        // console.log(user.email, classId, lectureId, rawNotesId);
        try {
          console.log("new raw notes fetch");
          console.log(user.email, classId, lectureId, rawNotesId);
          const userRawNotes = await getRawNotes(
            user.email,
            classId,
            lectureId,
            rawNotesIdFxn
          );
          console.log(userRawNotes);

          if (userRawNotes.notes) {
            //console.log(userRawNotes.notes);
            setRawNotes(userRawNotes.notes);
          } else {
            console.log("No notes found");
            setRawNotes(null);
            //console.log(rawNotes);
          }
        } catch (error) {
          console.log("Failed to get raw notes:", error);
        }
      } else {
        console.log("No user found to fetch notebooks");
      }
    };

    const fetchLecture = async () => {
      if (user) {
        try {
          console.log("new lecture fetch");
          const userLecture = await getLecture(user.email, classId, lectureId);

          if (userLecture) {
            setLectureNameDisplay(userLecture.lectureName);
            setRawNotesId(userLecture.rawNotesId);
            fetchNotes(userLecture.rawNotesId);
          } else {
            console.log("No Lecture found");
          }
        } catch (error) {
          console.log("Failed to get lecture:", error);
        }
      } else {
        console.log("No user found to fetch notebooks");
      }
    };
    fetchLecture();

    const intervalId = setInterval(() => {
      fetchLecture();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [user]);

  useEffect(() => {
    if (rawNotes && Array.isArray(rawNotes)) {
      let newPages = [];
      let currentPage = [];
      let currentPageHeight = 0;

      rawNotes.forEach((note, index) => {
        const noteHeight = calculateNoteHeight(note); // Implement this function based on note type
        if (currentPageHeight + noteHeight <= PAGE_HEIGHT) {
          currentPage.push(note);
          currentPageHeight += noteHeight;
        } else {
          newPages.push(currentPage);
          currentPage = [note];
          currentPageHeight = noteHeight;
        }
      });

      if (currentPage.length > 0) {
        newPages.push(currentPage);
      }

      setPages(newPages);
    }
  }, [rawNotes]);

  const renderPageContent = (pageContent) => {
    return pageContent.map((note, index) => renderNoteContent(note, index));
  };

  function calculateNoteHeight(note) {
    const BASE_HEIGHT = 24; // Base height for a single line of text
    let height = 0;

    if (note.whatToShow === "text") {
      note.textArray.forEach((item) => {
        height += BASE_HEIGHT; // Add height for the header

        // Check if item.points is defined and has elements
        if (item.points && item.points.length > 0) {
          height += item.points.length * BASE_HEIGHT; // Add height for each bullet point
        }
      });
    } else if (note.whatToShow === "image") {
      height = 300; // Assuming a fixed height for images, can be adjusted as needed
    }

    return height;
  }

  const renderNoteContent = (rawNote, rawNoteIndex) => {
    if (rawNote.whatToShow === "text") {
      return (
        <div key={`note-${rawNoteIndex}`} style={inlineStyles.section}>
          {rawNote.textArray.map((item, index) => (
            <React.Fragment key={`note-${rawNoteIndex}-text-${index}`}>
              <h2 style={inlineStyles.headerNotes}>{item.header}</h2>
              {item.points && item.points.length > 0 ? (
                item.points.map((point, idx) => (
                  <p
                    key={`note-${rawNoteIndex}-text-${index}-point-${idx}`}
                    style={inlineStyles.bulletPoint}
                  >
                    • {point}
                  </p>
                ))
              ) : (
                <p style={inlineStyles.bulletPoint}>No points available</p>
              )}
            </React.Fragment>
          ))}
        </div>
      );
    } else if (rawNote.whatToShow === "image") {
      return (
        <img
          key={`note-${rawNoteIndex}-image`}
          src={rawNote.imageUrl}
          alt={`Note ${rawNoteIndex}`}
          style={inlineStyles.imageStyle}
        />
      );
    }
    return null;
  };

  return (
    <div style={inlineStyles.container}>
      <div style={inlineStyles.header}>{lectureNameDisplay}</div>
      <div style={inlineStyles.pageContainer}>
        {pages.map((pageContent, pageIndex) => (
          <div key={`page-${pageIndex}`} style={inlineStyles.page}>
            {renderPageContent(pageContent)}
          </div>
        ))}
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
    padding: "0px",
    width: "100%",
    height: "100%",
    overflow: "auto",
  },
  header: {
    position: "fixed",
    top: "0",
    width: "100vw",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #ddd",
    padding: "10px 20px",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
  },
  pageContainer: {
    marginTop: "110px",
  },
  page: {
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 8px rgba(0,0,0,0.3)",
    margin: "0 auto",
    padding: "40px",
    width: "8.5in",
    minHeight: "11in",
    overflowY: "scroll",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    marginBottom: "80px",
  },
  section: {
    marginBottom: "20px",
  },
  headerNotes: {
    color: "black",
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "10px",
  },
  bulletPoint: {
    color: "black",
    fontSize: "16px",
    marginBottom: "5px",
  },
  imageStyle: {
    maxWidth: "80%",
    maxHeight: "600px",
    alignSelf: "center",
    marginBottom: "20px",
    alignSelf: "center",
  },
};
