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
  const [classId, setClassId] = useState(null);
  const [myTitle, setMyTitle] = useState(null);
  const auth = getAuth();
  const { createClass, getAllClassNames, deleteNotebook, editNotebookName } =
    useAuth();
  const user = auth.currentUser;
  const [inputClassName, setInputClassName] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notebookToDelete, setNotebookToDelete] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const openMenu = Boolean(menuAnchorEl);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [notebookToRename, setNotebookToRename] = useState(null);
  const [renamedNotebookName, setRenamedNotebookName] = useState("");
  const [newNotebookName, setNewNotebookName] = useState("");
  const [notebooks, setNotebooks] = useState([]);

  const handleRenameClick = (event, fxnClassId, fxnTitle) => {
    event.stopPropagation();
    setClassId(String(classId));
    // console.log(classId);
    setMenuAnchorEl(null);
    setRenamedNotebookName("");
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = async () => {
    try {
      // Call the editNotebookName function from your auth context
      await editNotebookName(
        String(user.email),
        String(classId),
        renamedNotebookName
      );

      setNotebooks(
        notebooks.map((n) =>
          n.classId === classId ? { ...n, className: renamedNotebookName } : n
        )
      );

      setRenamedNotebookName("");
      // Close the rename dialog
      setRenameDialogOpen(false);
      setNotebookToRename(null);
    } catch (error) {
      console.log("Error renaming the notebook:", error);
      // Optionally, you can show an error message to the user
    }
  };

  const handleMenuClick = (event, classId) => {
    event.stopPropagation();
    if (menuAnchorEl === event.currentTarget) {
      setMenuAnchorEl(null);
    } else {
      setClassId(classId);
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

  const handleDeleteClick = (event, fxnClassId) => {
    event.stopPropagation();
    setClassId(String(classId));
    // console.log(classId);
    setMenuAnchorEl(null);
    setClassId(classId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // Call the deleteNotebook function from your auth context

      await deleteNotebook(String(user.email), String(classId));

      // Filter out the deleted notebook and update the state
      setNotebooks(notebooks.filter((n) => n.classId !== classId));

      // Close the confirmation dialog
      setDeleteDialogOpen(false);
      setNotebookToDelete(null);
    } catch (error) {
      console.error("Error deleting the notebook:", error);
      // Optionally, you can show an error message to the user
    }
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const handleAddNewNotebook = () => {
    if (newNotebookName.trim()) {
      setNotebooks([...notebooks, { className: newNotebookName }]);
      setNewNotebookName("");
    }
    handleDialogClose();
  };

  useEffect(() => {
    //console.log(notebooks);
  }, [notebooks]);
  const handleCreateClass = async () => {
    if (newNotebookName) {
      // Ensure we are using the correct state variable
      try {
        console.log("handleCreateClass called with:", newNotebookName); // Debugging output
        console.log(user.email);
        await createClass(String(user.email), newNotebookName); // Create class
        console.log("Class created successfully"); // Debugging output

        setNotebooks((prevClasses) => [
          ...prevClasses,
          { className: newNotebookName },
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
          const userClasses = await getAllClassNames(user.email);
          //console.log("Fetched classes:", userClasses);
          if (userClasses && Array.isArray(userClasses)) {
            // Filter to only include "live" notebooks and prepend the "Add New" notebook
            const liveNotebooks = userClasses.filter(
              (c) => c.status === "live"
            ); // Filter for live notebooks
            //console.log("livenotebooks", liveNotebooks);
            setNotebooks(liveNotebooks);
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

  const getNotebookStyle = (index) => ({
    ...inlineStyles.notebook,
    backgroundColor: colors[index % colors.length], // Cycle through colors
  });

  const handleGoBack = () => {
    setOpenNotebook(null);
  };

  return (
    <div>
      <img
        src={BackpackImg}
        onClick={handleGoBack}
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          height: "160px",
          width: "160px",
          cursor: "pointer",
        }}
      />
      {openNotebook ? (
        <NotebookContent
          notebook={openNotebook}
          goBack={handleGoBack}
          classId={classId}
        />
      ) : (
        <div style={inlineStyles.notebooks}>
          <div
            style={{
              ...inlineStyles.notebook,
              backgroundColor: "white", // Cycle through colors
            }}
            onClick={() => {
              handleDialogOpen();
            }}
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
            <span style={inlineStyles.addIcon}>
              <span style={inlineStyles.plus}>+</span>
              <span style={inlineStyles.newNotebook}>New Notebook</span>
            </span>
          </div>

          {notebooks.map((item, index) => (
            <Notebook
              setClassId={setClassId}
              classId={item.classId}
              title={item.className}
              handleRenameClick={handleRenameClick}
              handleDeleteClick={handleDeleteClick}
              openMenu={openMenu}
              handleMenuClose={handleMenuClose}
              handleMenuClick={handleMenuClick}
              getNotebookStyle={getNotebookStyle}
              index={index}
              menuAnchorEl={menuAnchorEl}
              setMenuAnchorEl={setMenuAnchorEl}
              setMyTitle={setMyTitle}
              setOpenNotebook={setOpenNotebook}
              item={item}
            />
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
            autoComplete="off"
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
      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
      >
        <DialogTitle>Rename Notebook</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Notebook Name"
            type="text"
            fullWidth
            variant="outlined"
            value={renamedNotebookName}
            onChange={(e) => setRenamedNotebookName(e.target.value)}
            autoComplete="off"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRenameConfirm}>Rename</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ListOfNotebooks;

const Notebook = ({
  setClassId,
  classId,
  title,
  handleRenameClick,
  handleDeleteClick,
  openMenu,
  handleMenuClose,
  handleMenuClick,
  index,
  menuAnchorEl,
  setMenuAnchorEl,
  setMyTitle,
  setOpenNotebook,
  item,
}) => {
  const getNotebookStyle = (index) => ({
    ...inlineStyles.notebook,
    backgroundColor: colors[index % colors.length], // Cycle through colors
  });

  return (
    <div
      style={getNotebookStyle(index)}
      onClick={() => {
        setClassId(classId);
        setOpenNotebook(item);
      }}
      key={classId}
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

      <MoreVertIcon
        className={`menu-icon hidden`}
        onClick={(e) => handleMenuClick(e, classId)}
      />

      <Menu
        anchorEl={menuAnchorEl}
        open={openMenu}
        onClose={handleMenuClose}
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
            setClassId(classId);
            console.log(title);
            setMyTitle(title);
            handleRenameClick(e, classId, title);
          }}
        >
          Rename
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            setClassId(classId);
            console.log(title);
            setMyTitle(title);
            handleDeleteClick(e, classId);
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      <span style={inlineStyles.title}>{title}</span>
    </div>
  );
};

const inlineStyles = {
  backpack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "20px 100px",
  },
  notebooks: {
    margin: "40px 200px 100px 20vw",
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
    textAlign: "center",
  },
  icon: (id) => ({
    position: "absolute",
    top: "0px",
    right: "5px",
    display: "none",
    cursor: "pointer",
    fontSize: "30px",
  }),
  addIcon: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "center",
    position: "relative",
    top: "-10px",
  },

  newNotebook: {
    fontSize: "20px",
    color: "black",
    marginLeft: "8px",
    fontWeight: "none",
    margin: "0",
  },
  plus: { margin: "0" },
};

const colors = [
  "#FFADAD",
  "#FFD6A5",
  "#FDFFB6",
  "#CAFFBF",
  "#9BF6FF",
  "#A0C4FF",
  "#BDB2FF",
  "#FFC6FF",
  "#BEE9E8",
  "#F0B5B3",
  "#FF9AA2",
];
