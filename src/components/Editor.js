import React, { useCallback, useEffect, useState } from "react";
import "./Editor.css";
import { useAuth } from "../contexts/AuthContext";
import { getAuth } from "firebase/auth";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillImageDropAndPaste from "quill-image-drop-and-paste";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BackpackImg from "../images/unzippedBackpackBlue.png";
import { useLocation } from "react-router-dom";
import { ArrowRightAltOutlined } from "@mui/icons-material";

Quill.register("modules/imageDropAndPaste", QuillImageDropAndPaste);

const fontSizeScaleFactor = 2;

const COLORS = [
  "#000000",
  "#666666",
  "#999999",
  "#d9d9d9",
  "#efefef",
  "#f3f3f3",
  "#ffffff",

  "#FF0100",
  "#FF9902",
  "#FEFF05",
  "#01FF00",
  "#00FFFF",
  "#1000FF",
  "#FF01FF",

  "#F4CDCC",
  "#FDE5CD",
  "#FFF2CC",
  "#D9EAD3",
  "#D0E0E4",
  "#D0E2F4",
  "#EAD1DD",
  "#E06666",
  "#F9CC9C",
  "#FFD966",
  "#94C47D",
  "#76A5B0",
  "#6FA8DD",
  "#C27BA1",
  "#CD0000",
  "#E79238",
  "#F1C233",
  "#6AA84F",
  "#46818E",
  "#3D85C6",
  "#A64E7A",
  "#990000",
  "#B45F06",
  "#BF9002",
  "#38761D",
  "#144F5D",
  "#0A5395",
  "#741B47",
];

const fontSizeArr = [
  "8px",
  "9px",
  "10px",
  "12px",
  "14px",
  "16px",
  "20px",
  "24px",
  "32px",
  "42px",
  "54px",
  "68px",
  "84px",
  "98px",
];

var fonts = [
  "Arial",
  "Courier",
  "Garamond",
  "Tahoma",
  "Times New Roman",
  "Verdana",
];

function getFontName(font) {
  return font.toLowerCase().replace(/\s/g, "-");
}
var fontNames = fonts.map((font) => getFontName(font));

var fontStyles = "";
fonts.forEach(function (font) {
  var fontName = getFontName(font);
  fontStyles +=
    ".ql-snow .ql-picker.ql-font .ql-picker-label[data-value=" +
    fontName +
    "]::before, .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=" +
    fontName +
    "]::before {" +
    "content: '" +
    font +
    "';" +
    "font-family: '" +
    font +
    "', sans-serif;" +
    "}" +
    ".ql-font-" +
    fontName +
    "{" +
    " font-family: '" +
    font +
    "', sans-serif;" +
    "}";
});
var node = document.createElement("style");
node.innerHTML = fontStyles;
document.body.appendChild(node);
var Font = Quill.import("formats/font");
Font.whitelist = fontNames;
Quill.register(Font, true);

var Size = Quill.import("attributors/style/size");
Size.whitelist = fontSizeArr;
Quill.register(Size, true);

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ font: fontNames }],
  [{ size: fontSizeArr }],

  ["bold", "italic", "underline"],
  [
    {
      color: COLORS,
    },
    { background: COLORS },
  ],
  [{ align: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [("image", "code-block")],
];

export default function TextEditor() {
  const location = useLocation();
  const [quill, setQuill] = useState();
  const auth = getAuth();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const user = auth.currentUser;
  console.log(user.photoURL);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const openUserMenu = Boolean(userMenuAnchorEl);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const classId = searchParams.get("c");
  const lectureId = searchParams.get("l");
  const [rawNotes, setRawNotes] = useState(null);
  const [rawNotesId, setRawNotesId] = useState("");
  const {
    getRawNotes,
    getLecture,
    getStyledNotes,
    createStyledNotes,
    saveStyledNotes,
  } = useAuth();
  const [lectureName, setLectureName] = useState("");
  const [abbrevDate, setAbbrevDate] = useState("");
  const [className, setClassName] = useState("");
  const [styledNotesExist, setStyledNotesExist] = useState(null);

  const handlePhotoClick = (index) => {
    const qlEditors = document.querySelectorAll(".container .ql-editor");
    const qlContainers = document.querySelectorAll(
      ".container .ql-container.ql-snow"
    );

    if (selectedPhoto === index) {
      setSelectedPhoto(null);
      document.querySelector(
        ".container .ql-container.ql-snow"
      ).style.justifyContent = "center";
      document.querySelector(".container .ql-editor").style.marginRight = "0px";
    } else {
      document.querySelector(
        ".container .ql-container.ql-snow"
      ).style.justifyContent = "end";
      document.querySelector(".container .ql-editor").style.marginRight =
        "20px";
      setSelectedPhoto(index);
    }
  };

  useEffect(() => {
    if (selectedPhoto) {
      document.querySelector(
        ".container .ql-container.ql-snow"
      ).style.justifyContent = "end";
      document.querySelector(".container .ql-editor").style.marginRight =
        "20px";
    }

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
            setLectureName(userLecture.lectureName);
            setAbbrevDate(userLecture.abbrevDate);
            setRawNotesId(userLecture.rawNotesId);
            setClassName(userLecture.className);
            fetchNotes(userLecture.rawNotesId);
            if (userLecture.styledNotesId) {
              setStyledNotesExist(true);
            } else setStyledNotesExist(false);
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

  const handleUserMenuClick = (event) => {
    event.stopPropagation();

    if (userMenuAnchorEl === event.currentTarget) {
      setUserMenuAnchorEl(null);
    } else {
      // setClassId(classId);
      setUserMenuAnchorEl(event.currentTarget);
    }
  };

  const handleUserMenuClose = (event) => {
    // Check if the event exists and stop propagation
    if (event) {
      event.stopPropagation();
    }
    setUserMenuAnchorEl(null);
  };

  const imageHandler = (imageDataUrl, type, imageData) => {};

  useEffect(() => {
    if (quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
  }, [quill]);

  useEffect(() => {
    if (quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill]);

  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper == null) return;
      if (!rawNotes) return;

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const q = new Quill(editor, {
        theme: "snow",
        modules: {
          imageDropAndPaste: {
            handler: imageHandler,
          },
          toolbar: TOOLBAR_OPTIONS,
        },
      });

      const addRawNotesToQuill = () => {
        if (!rawNotes || !Array.isArray(rawNotes)) return;

        let currentIndex = 0; // Initialize the current index

        rawNotes.forEach((note) => {
          if (note.whatToShow === "text") {
            note.textArray.forEach((item) => {
              // Insert the header
              q.insertText(currentIndex, item.header + "\n", {
                bold: true,
                font: "20px",
              });
              currentIndex += item.header.length + 1; // Update the current index

              // Insert the points
              if (item.points && item.points.length > 0) {
                item.points.forEach((point) => {
                  q.insertText(currentIndex, point + "\n", {
                    list: "bullet",
                    font: ["16px"],
                  });
                  currentIndex += point.length + 1; // Update the current index
                });
              }
            });
          } else if (note.whatToShow === "image" && note.imageUrl) {
            //  console.log(note.imageUrl);
            // q.insertEmbed(currentIndex, "image", note.imageUrl);
            //  currentIndex += 1; // Update the current index for the image
            // Insert a newline after the image
            // q.insertText(currentIndex, "\n");
            //  currentIndex += 1; // Update the current index for the newline
          }
        });
      };

      addRawNotesToQuill();

      setQuill(q);
    },
    [rawNotes]
  );
  return (
    <div style={{ width: "100vw", background: "#fafbfd" }}>
      <div
        style={{
          position: "fixed",
          top: "0",
          width: "100vw",
          background: "#fafbfd",
          height: "110px",
          zIndex: "4",
          borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
          boxShadow: "0px 2px 6px 0px rgba(0, 0, 0, 0.2)",
        }}
      ></div>
      <div
        style={{
          display: "flex", // Enable flexbox
          justifyContent: "space-between", // Center content horizontally
          alignItems: "center", // Center content vertically
          width: "100vw",
          zIndex: "2",
          height: "40px",
          position: "fixed",
          top: "0",
          left: "50%",
          zIndex: "5",
          transform: "translateX(-50%)", // Adjust for centering the div itself
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            padding: "0",
            zIndex: "2",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <img
            src={BackpackImg}
            style={{
              height: "39px",
              width: "39px",
              cursor: "pointer",
              borderRadius: "50px",
              zIndex: "2",
              margin: "0",
            }}
            onClick={() => {
              navigate("/");
            }}
          />
          <div
            style={{
              marginLeft: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {lectureName && (
              <h2 style={{ fontSize: "14px", marginBottom: "5px" }}>
                {lectureName}
              </h2>
            )}
            <div style={{ display: "flex" }}>
              {className && (
                <h2 style={{ fontSize: "12px" }}>
                  {className}
                  {"  "}&bull;
                </h2>
              )}
              {abbrevDate && (
                <h2 style={{ fontSize: "12px", marginLeft: "3px" }}>
                  {abbrevDate}
                </h2>
              )}
            </div>
          </div>
        </div>
        {user && user.photoURL ? (
          <img
            src={user.photoURL}
            style={{
              position: "fixed",
              top: "10px",
              right: "10px",
              height: "39px",
              width: "39px",
              cursor: "pointer",
              borderRadius: "50px",
              zIndex: "2",
            }}
            onClick={handleUserMenuClick}
          />
        ) : (
          <div
            style={{
              position: "fixed",
              top: "10px",
              right: "10px",
              height: "39px",
              width: "39px",
              cursor: "pointer",
              borderRadius: "50px",
              backgroundColor: "#FF008F",
              display: "flex",
              color: "white",
              alignItems: "center",
              justifyContent: "center",
              zIndex: "2",
              padding: "0",
            }}
            onClick={handleUserMenuClick}
          >
            {user && (
              <h1 style={{ margin: "0", padding: "0", fontSize: "24px" }}>
                {user.email[0].toUpperCase()}
              </h1>
            )}
          </div>
        )}
      </div>
      <Menu
        anchorEl={userMenuAnchorEl}
        open={openUserMenu}
        onClose={handleUserMenuClose}
        PaperProps={{
          style: {
            boxShadow: "0px 10px 15px rgba(0,0,0,.15)", // Apply the subtle box shadow
            transform: "translate3d(0,0,0)", // Reset transform to default if needed
          },
        }}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            console.log("logout");
            logout();
            navigate("/auth");
          }}
        >
          Log Out
        </MenuItem>
      </Menu>
      <div
        style={{
          position: "absolute",
          left: "0",
          top: "120px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          paddingLeft: "25px",
          overflowY: "auto", // Enables vertical scrolling
          minHeight: "400px", // Adjust the height as needed
          zIndex: "2",
          minWidth: "300px",
          paddingTop: "20px",
          paddingBottom: "20px",
          paddingRight: "20px",
        }}
      >
        {rawNotes && Array.isArray(rawNotes)
          ? rawNotes.map((rawNote, rawNoteIndex) =>
              rawNote.whatToShow === "image" ||
              rawNote.whatToShow === "text" ? (
                <img
                  key={`note-${rawNoteIndex}-image`}
                  src={rawNote.imageUrl}
                  alt={`note-${rawNoteIndex}`}
                  className="rawnote-photo"
                  onClick={() => handlePhotoClick(rawNoteIndex)} // Set the selected photo on click
                  style={{
                    width: selectedPhoto === rawNoteIndex ? "550px" : "150px", // Change width based on selection
                    height: "auto",
                    borderRadius: "20px",
                    border: "3px solid white",
                    boxShadow:
                      selectedPhoto === rawNoteIndex
                        ? " 0 0 0 3px #0a57d0"
                        : "0 0 0 2px #D4D6D5", // This creates a blue 'border' outside the image
                    zIndex: "4",
                  }} // You can customize this style
                />
              ) : null
            )
          : null}
      </div>

      <div className="container" ref={wrapperRef}></div>
    </div>
  );
}

//Try to fetch a styled note
///set quill from styled notes
/// if no syled note, add rawnotes to Quill and create styled notes.

///Allow edit lecturename
