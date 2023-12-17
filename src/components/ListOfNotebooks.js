import { AirlineSeatReclineNormalRounded } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import Spiral from "../images/spiral.png";
import { useAuth } from "../contexts/AuthContext";
import { getAuth } from "firebase/auth";
import NotebookContent from "./NotebookContent";
import BackpackImg from "../images/unzippedBackpackBlue.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem } from "@mui/material";
import "./ListOfNotebooks.css";

function ListOfNotebooks() {
  const [hoveredNotebook, setHoveredNotebook] = useState(null);
  const [openNotebook, setOpenNotebook] = useState(null);
  const [color, setColor] = useState(null);
  const auth = getAuth();
  const { getUser, createClass, getAllClassNames, deleteNotebook } = useAuth();
  const user = auth.currentUser;
  const [inputClassName, setInputClassName] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notebookToDelete, setNotebookToDelete] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const openMenu = Boolean(menuAnchorEl);

  const handleMenuClick = (event, notebook) => {
    event.stopPropagation();
    if (menuAnchorEl === event.currentTarget) {
      // If the current menu is already open for this notebook, close it
      setMenuAnchorEl(null);
    } else {
      // Otherwise, open the menu for this notebook
      setMenuAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = (event) => {
    // Check if the event exists and stop propagation
    if (event) {
      event.stopPropagation();
    }
    setMenuAnchorEl(null);
  };
  const handleDeleteClick = (event, notebook) => {
    event.stopPropagation(); // Prevents event from bubbling up to parent elements
    setMenuAnchorEl(null);
    setNotebookToDelete(notebook);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (notebookToDelete) {
      try {
        // Call the deleteNotebook function from your auth context
        await deleteNotebook(String(user.uid), notebookToDelete.name);

        // Filter out the deleted notebook and update the state
        setNotebooks(notebooks.filter((n) => n.name !== notebookToDelete.name));

        // Close the confirmation dialog
        setDeleteDialogOpen(false);
        setNotebookToDelete(null);
      } catch (error) {
        console.error("Error deleting the notebook:", error);
        // Optionally, you can show an error message to the user
      }
    }
  };
  const [newNotebookName, setNewNotebookName] = useState("");
  const [notebooks, setNotebooks] = useState([{ name: "Add New" }]);
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const handleAddNewNotebook = () => {
    if (newNotebookName.trim()) {
      setNotebooks([...notebooks, { name: newNotebookName }]);
      setNewNotebookName("");
    }
    handleDialogClose();
  };

  const handleCreateClass = async () => {
    console.log("handleCreateClass called with:", newNotebookName); // Debugging output

    if (newNotebookName) {
      // Ensure we are using the correct state variable
      try {
        await createClass(user.uid, newNotebookName); // Create class
        console.log("Class created successfully"); // Debugging output

        setNotebooks((prevClasses) => [
          ...prevClasses,
          { name: newNotebookName },
        ]);
        setNewNotebookName(""); // Reset input field
        setIsDialogOpen(false); // Close dialog
      } catch (error) {
        console.error("Error creating class:", error);
        // Optionally, show an error message to the user
      }
    } else {
      console.log("No class name provided"); // Debugging output
    }
  };
  useEffect(() => {
    async function fetchClasses() {
      if (user) {
        try {
          const userClasses = await getAllClassNames(user.uid);
          console.log("Fetched classes:", userClasses);
          if (userClasses && Array.isArray(userClasses)) {
            // Filter to only include "live" notebooks and prepend the "Add New" notebook
            const liveNotebooks = userClasses
              .filter((c) => c.status === "live") // Filter for live notebooks
              .map((c) => ({ name: c.className, status: c.status }));

            setNotebooks([{ name: "Add New" }, ...liveNotebooks]);
          } else {
            console.error("Invalid data format received");
          }
        } catch (error) {
          console.error("Failed to fetch classes:", error);
        }
      } else {
        console.log("No user found");
      }
    }

    fetchClasses();
  }, [user, getAllClassNames]);

  const colors = [
    "white",
    "#FFADAD",
    "#FFD6A5",
    "#FDFFB6",
    "#CAFFBF",
    "#9BF6FF",
    "#A0C4FF",
    "#BDB2FF",
    "#FFC6FF",
    "#FFFFFC",
    "#BEE9E8",
    "#F0B5B3",
    "#FF9AA2",
  ];
  const getNotebookStyle = (index) => ({
    ...inlineStyles.notebook,
    backgroundColor: colors[index % colors.length], // Cycle through colors
  });

  const handleGoBack = () => {
    setOpenNotebook(null);
  };
  /*
  const notebooks = [
    { name: "Add New" },

    
    { name: "Calculus II", content: ["Lecture 1", "Lecture 2"] },
    { name: "Biology II", content: ["Lecture 1", "Lecture 2"] },
    { name: "Physics II", content: ["Lecture 1", "Lecture 2"] },
    { name: "Psychology", content: ["Lecture 1", "Lecture 2"] },
    { name: "Fluid Mechanics", content: ["Lecture 1", "Lecture 2"] },
    { name: "Solidworks", content: ["Lecture 1", "Lecture 2"] },
    { name: "Calculus II", content: ["Lecture 1", "Lecture 2"] },
    { name: "Biology II", content: ["Lecture 1", "Lecture 2"] },
    { name: "Physics II", content: ["Lecture 1", "Lecture 2"] },
    { name: "Psychology", content: ["Lecture 1", "Lecture 2"] },
    { name: "Fluid Mechanics", content: ["Lecture 1", "Lecture 2"] },
    { name: "Solidworks", content: ["Lecture 1", "Lecture 2"] },

    // ... any number of notebooks
  ];*/
  const inlineStyles = {
    backpack: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      margin: "20px 100px",
    },
    notebooks: {
      margin: "20px 200px 100px 30vw",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      width: "70vw",
      flexWrap: "wrap", // This allows the items to wrap to the next line
      justifyContent: "flex-start",
      gap: "100px",
    },
    notebook: {
      border: "3px solid black",
      padding: "10px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      position: "relative",
      cursor: "pointer",
      minHeight: "200px",
      width: "150px",
      padding: "20px",
    },
    title: {
      fontSize: "20px",
      fontWeight: "bold",
      margin: "5px 0",
    },
    icon: (id) => ({
      position: "absolute",
      top: "0px",
      right: "5px",
      display: hoveredNotebook === id ? "block" : "none",
      cursor: "pointer",
      fontSize: "30px",
    }),
    addIcon: {
      fontSize: "50px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    menuIcon: (id) => ({
      position: "absolute",
      top: "5px",
      right: "5px",
      display: hoveredNotebook === id ? "block" : "none",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "black",
        borderRadius: "50%",
      },
    }),
  };
  const notebooksWithColor = notebooks.map((notebook, index) => ({
    ...notebook,
    color: colors[index % colors.length],
  }));

  return (
    <div style={inlineStyles.backpack}>
      <img
        src={BackpackImg}
        onClick={handleGoBack}
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          height: "150px",
          width: "150px",
          cursor: "pointer",
        }}
      />
      {openNotebook ? (
        <NotebookContent notebook={openNotebook} goBack={handleGoBack} />
      ) : (
        <div style={inlineStyles.notebooks}>
          {notebooks.map((notebook, index) => (
            <div
              style={getNotebookStyle(index)}
              onMouseEnter={() => setHoveredNotebook(index)}
              onMouseLeave={() => setHoveredNotebook(null)}
              onClick={() => {
                if (index !== 0) {
                  setOpenNotebook({
                    ...notebook,
                    color: getNotebookStyle(index).backgroundColor,
                  });
                } else {
                  // Only for the "Add New" notebook, display the button to open dialog
                  handleDialogOpen();
                }
              }}
              key={notebook.className || index}
            >
              <img
                src={Spiral}
                style={{
                  height: "180px",
                  position: "absolute",
                  top: "7px",
                  right: "55px",
                }}
              />
              {index !== 0 && (
                <>
                  <MoreVertIcon
                    className={`menu-icon ${
                      hoveredNotebook === index ? "" : "hidden"
                    }`}
                    onClick={(e) => handleMenuClick(e, notebook)}
                  />
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                    PaperProps={{
                      style: {
                        transform: "translate3d(0,0,0)", // Reset transform to default if needed
                      },
                    }}
                  >
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      Rename
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(e, notebook);
                      }}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </>
              )}
              {index !== 0 && (
                <span style={inlineStyles.title}>{notebook.name}</span>
              )}
              {index === 0 && <span style={inlineStyles.addIcon}>+</span>}
            </div>
          ))}
        </div>
      )}
      {/* Dialog for creation */}

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New Notebook</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notebook Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newNotebookName}
            onChange={(e) => setNewNotebookName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleCreateClass}>Add</Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation dialog for deletion */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this notebook?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ListOfNotebooks;
