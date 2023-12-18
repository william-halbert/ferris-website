import React, { useState, useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";
import { getAuth } from "firebase/auth";
import LectureView from "./LectureView";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem } from "@mui/material";
import "./NotebookContent.css";

export default function NotebookContent({ notebook, goBack }) {
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const openMenu = Boolean(menuAnchorEl);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog visibility
  const [newLectureName, setNewLectureName] = useState(""); // State to hold the new lecture name
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [lectureToRename, setLectureToRename] = useState(null);
  const [renamedLectureName, setRenamedLectureName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const { createLecture, getAllLectures } = useAuth();
  const [lectures, setLectures] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  const getAbbreviatedDate = () => {
    const now = new Date();
    const year = now.getFullYear().toString().substr(-2);
    const month = now.toLocaleString("default", { month: "short" });
    const day = now.getDate();

    return `${month} ${day}, '${year}`;
  };

  const handleDeleteClick = (event, lecture) => {
    event.stopPropagation(); // Prevents event from bubbling up to parent elements
    setMenuAnchorEl(null);
    setLectureToDelete(lecture);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (lectureToDelete) {
      // Filter out the lecture to delete and update the state
      const updatedLectures = lectures.filter((l) => l !== lectureToDelete);
      setLectures(updatedLectures);

      // Reset states and close the dialog
      setDeleteDialogOpen(false);
      setLectureToDelete(null);
    }
  };

  const handleCreateLecture = async () => {
    try {
      const abbrevdate = getAbbreviatedDate();
      const newLecture = { name: newLectureName, date: abbrevdate };

      await createLecture(
        String(user.uid),
        String(notebook.classId),
        notebook.name,
        newLectureName,
        abbrevdate
      ); // Create class
      console.log("Class created successfully"); // Debugging output
      setLectures((prevLectures) => [...prevLectures, newLecture]);

      setIsDialogOpen(false);
      setNewLectureName("");
    } catch (error) {
      console.error("Error creating class:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleRenameConfirm = () => {
    if (lectureToRename && renamedLectureName) {
      // Update the lecture list with the new name
      const updatedLectures = lectures.map((lecture) => {
        if (lecture === lectureToRename) {
          return { ...lecture, name: renamedLectureName };
        }
        return lecture;
      });
      setLectures(updatedLectures);
      // Reset states and close the dialog
      setRenameDialogOpen(false);
      setLectureToRename(null);
      setRenamedLectureName("");
    }
  };

  const handleRenameClick = (event, lecture) => {
    event.stopPropagation();
    setMenuAnchorEl(null);
    setLectureToRename(lecture);
    setRenamedLectureName(lecture.name);
    setRenameDialogOpen(true);
  };

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

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

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
      margin: "40px 0 100px 15vw",
      display: "flex", // Changed from grid to flex
      flexWrap: "wrap", // Allow items to wrap to the next line
      gap: "40px", // Adjust the spacing between items
      justifyContent: "flex-start", // Align items to the start of the container
      padding: "20px", // Add padding around the grid if needed
      width: "80vw",
    },
    lectureItem: {
      border: "none",
      padding: "10px 60px 10px 10px", // Adjust padding to match the design
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      justifyContent: "center",
      height: "80px", // Adjust height as needed
      cursor: "pointer",
      color: "black",
      width: "180px",
      borderRadius: "10px",
      background: "rgba(200,200,200,.2)",
      position: "relative", // Add relative positioning
      lineHeight: "18px",
    },
    addLectureItem: {
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "32px",
      padding: "0",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "180px",
      height: "80px",
      boxShadow: "0px 1px 3px rgba(0,0,0,.3)",
    },
    menuIcon: {
      cursor: "pointer",
    },

    lectureDate: {
      fontSize: "14px", // Adjust font size as needed
      color: "#666",
      position: "absolute",
      top: "5px",
      left: "10px",
    },
    newLecture: {
      fontSize: "16px",
      color: "black",
      marginLeft: "8px",
    },
    plus: {
      position: "relative",
      top: "-3px",
    },
    lectureName: {
      position: "relative",
      width: "120px",
    },
    lectureNameAndMenu: {
      position: "absolute",
      bottom: "5px",
      left: "10px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: "60px",
      width: "170px",
    },
  };

  return (
    <div style={inlineStyles.lectureGrid}>
      <div
        style={inlineStyles.addLectureItem}
        onClick={() => setIsDialogOpen(true)}
      >
        <span style={inlineStyles.plus}>+</span>
        <span style={inlineStyles.newLecture}>New Lecture</span>
      </div>
      {lectures.map((lecture, index) => {
        return (
          <div
            key={index}
            style={{
              ...inlineStyles.lectureItem,
            }}
            // Removed the onClick handler for the entire div to avoid opening the lecture when clicking the menu
          >
            <div style={inlineStyles.lectureDate}>{lecture.date}</div>
            <div style={inlineStyles.lectureNameAndMenu}>
              <div style={inlineStyles.lectureName}>{lecture.name}</div>
              <MoreVertIcon
                className="menu-item-nc"
                onClick={handleMenuClick}
              />
            </div>

            <Menu
              anchorEl={menuAnchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  boxShadow: "0px 10px 15px rgba(0,0,0,.15)", // Apply the subtle box shadow
                  // Include other styles for the menu here if necessary
                },
              }}
            >
              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleRenameClick(e, lecture);
                }}
              >
                Rename
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(e, lecture);
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </div>
        );
      })}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Add New Lecture</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Lecture Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newLectureName}
            onChange={(e) => setNewLectureName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateLecture}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
      >
        <DialogTitle>Rename Lecture</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Lecture Name"
            type="text"
            fullWidth
            variant="outlined"
            value={renamedLectureName}
            onChange={(e) => setRenamedLectureName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRenameConfirm}>Rename</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this lecture?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
