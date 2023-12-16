import { AirlineSeatReclineNormalRounded } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import BackpackImg from "../images/backpackBlue.png";
import Spiral from "../images/spiral.png";
import { useAuth } from "../contexts/AuthContext";
import { getAuth } from "firebase/auth";
import NotebookContent from "./NotebookContent";

function ListOfNotebooks() {
  const [hoveredNotebook, setHoveredNotebook] = useState(null);
  const [openNotebook, setOpenNotebook] = useState(null);
  const [color, setColor] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const [classes, setClasses] = useState([]);
  const { getUser, createClass, getAllClassNames } = useAuth();
  const [inputClassName, setInputClassName] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(null);
  const handleCreateClass = async () => {
    if (inputClassName) {
      try {
        await createClass(user.uid, inputClassName);
        setClasses((prevClasses) => [
          ...prevClasses,
          { className: inputClassName },
        ]);
        setInputClassName("");
        setDialogVisible(false);
      } catch (error) {
        console.error("Error creating class:", error);
      }
    }
  };
  useEffect(() => {
    async function fetchClasses() {
      if (user) {
        try {
          const userClasses = await getAllClassNames(user.uid);
          setClasses(userClasses);
          console.log(userClasses);
        } catch (error) {
          console.error("Failed to fetch classes:", error);
        }
      } else {
        console.log("no user");
      }
    }

    //fetchClasses();
  }, []);

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
  const notebooks = [
    { name: "Add New" },
    {
      name: "Chemistry",
      content: [
        "Lecture 1",
        "Lecture 2",
        "Lecture 3",
        "Lecture 4",
        "Lecture 5",
        "Lecture 6",
        "Lecture 7",
        "Lecture 8",
        "Lecture 9",
        "Lecture 2",
        "Lecture 3",
        "Lecture 4",
        "Lecture 5",
        "Lecture 6",
        "Lecture 7",
        "Lecture 8",
        "Lecture 9",
        "Lecture 2",
        "Lecture 3",
        "Lecture 4",
        "Lecture 5",
        "Lecture 6",
        "Lecture 7",
        "Lecture 8",
        "Lecture 9",
      ],
    },
    { name: "Calculus II", content: ["Lecture 1", "Lecture 2"] },
    { name: "Biology II", content: ["Lecture 1", "Lecture 2"] },
    { name: "Physics II", content: ["Lecture 1", "Lecture 2"] },
    { name: "Psychology", content: ["Lecture 1", "Lecture 2"] },
    { name: "Fluid Mechanics", content: ["Lecture 1", "Lecture 2"] },
    { name: "Solidworks", content: ["Lecture 1", "Lecture 2"] },

    // ... any number of notebooks
  ];
  const inlineStyles = {
    backpack: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      margin: "20px 100px",
    },
    notebooks: {
      margin: "10px 200px",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      width: "100%",
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
  };
  const notebooksWithColor = notebooks.map((notebook, index) => ({
    ...notebook,
    color: colors[index % colors.length],
  }));

  return (
    <div style={inlineStyles.backpack}>
      <h1
        onClick={handleGoBack}
        style={{ fontSize: "50px", cursor: "pointer" }}
      >
        <img
          src={BackpackImg}
          style={{ height: "100px", marginRight: "15px" }}
        />
      </h1>
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
                  // Prevent "Add New" from being set as the open notebook
                  setOpenNotebook({
                    ...notebook,
                    color: getNotebookStyle(index).backgroundColor,
                  });
                }
              }}
              key={notebook.name}
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
                <span style={inlineStyles.title}>{notebook.name}</span>
              )}
              {index === 0 ? (
                <span style={inlineStyles.addIcon}>+</span>
              ) : (
                <span style={inlineStyles.icon(index)}>X</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListOfNotebooks;
