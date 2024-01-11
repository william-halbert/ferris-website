import React, { useEffect, useState } from "react";
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
  }, [user]);

  const renderNoteContent = (rawNote, rawNoteIndex) => {
    if (rawNote.whatToShow === "text") {
      return (
        <div key={`note-${rawNoteIndex}`} style={inlineStyles.section}>
          {rawNote.textArray.map((item, index) => (
            <React.Fragment key={`note-${rawNoteIndex}-text-${index}`}>
              <h2 style={inlineStyles.headerNotes}>{item.header}</h2>
              {item.points.map((point, idx) => (
                <p
                  key={`note-${rawNoteIndex}-text-${index}-point-${idx}`}
                  style={inlineStyles.bulletPoint}
                >
                  • {point}
                </p>
              ))}
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
        {/* Render pages here. You can map over an array of page data if they are dynamic */}
        <div style={inlineStyles.page}>
          {rawNotes && Array.isArray(rawNotes) ? (
            rawNotes.map(renderNoteContent)
          ) : (
            <p>Start taking notes!</p>
          )}
        </div>
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
    padding: "0px",
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
    padding: "40px",
    width: "8.5in",
    minHeight: "11in",
    overflowY: "scroll",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },
  section: {
    marginBottom: "20px",
  },
  headerNotes: {
    color: "black",
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "10px",
  },
  bulletPoint: {
    color: "black",
    fontSize: "18px",
    marginBottom: "5px",
  },
  imageStyle: {
    maxWidth: "80%",
    alignSelf: "center",
    marginBottom: "20px",
    alignSelf: "center",
  },
};
