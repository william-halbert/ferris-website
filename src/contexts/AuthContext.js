import React, { useContext, useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import {
  setDoc,
  Timestamp,
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

import { db } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const storage = getStorage();
  const [noteInfo, setNoteInfo] = useState({ className: "", noteName: "" });

  const auth = getAuth();

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token which you can use to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // You can now use this to set your user in state or context
      setCurrentUser(user);
      // Access user's name and photo URL
      const name = user.displayName;
      const photoUrl = user.photoURL;

      // Check if the user is new or existing
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // If user does not exist, create a new user record
      if (!docSnap.exists()) {
        await createUser(user.uid, user.email, name, photoUrl);
      }

      return { success: true };
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // You can now use this to display an error message
      setAuthError(errorMessage);
      return { success: false, errorMessage };
    }
  }

  async function deleteNotebook(uid, classId) {
    try {
      await setDoc(
        doc(db, "users", uid, "classes", classId),
        {
          status: "deleted",
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error moving item to trash in Firestore: ", error);
    }
  }

  async function deleteLecture(uid, classId, lectureId) {
    try {
      const docRef = doc(
        db,
        "users",
        uid,
        "classes",
        classId,
        "lectures",
        lectureId
      );

      console.log(`Attempting to update: ${docRef.path}`);

      await setDoc(docRef, { status: "deleted" }, { merge: true });

      console.log("Lecture status updated to 'deleted'");
    } catch (error) {
      console.error("Error moving item to trash in Firestore: ", error);
    }
  }

  async function uploadLectureImage(base64) {
    const storageRef = ref(storage, "some-child");

    try {
      const snapshot = await uploadString(storageRef, base64, "base64");
      console.log("Uploaded a base64 string!");
      const downloadURL = await getDownloadURL(snapshot.ref);
      return {
        success: true,
        downloadURL: downloadURL,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }

  async function signup(email, password) {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (user) {
        await createUser(user.uid, email);
        await sendEmailVerification(user).then(
          console.log("sent email verification")
        );
      }
    } catch (err) {
      return err.message;
    }
    return "success";
  }

  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password).then((user) => {
        setCurrentUser(user);
      });
    } catch (err) {
      return err.message;
    }

    return "success";
  }

  function logout() {
    try {
      signOut(auth);
    } catch (err) {
      setAuthError(err);
    }
  }

  async function saveNoteResponse(uid, className, noteTitle, responses) {
    try {
      await setDoc(
        doc(db, "users", String(uid), "classes", className, "notes", noteTitle),
        {
          responses: responses,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving conversation to Firestore: ", error);
    }
  }

  async function saveGptResponse(uid, className, noteTitle, responses) {
    try {
      await setDoc(
        doc(db, "users", String(uid), "classes", className, "notes", noteTitle),
        {
          gptResponses: responses,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving conversation to Firestore: ", error);
    }
  }

  async function getUser(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    return docSnap.data();
  }

  async function createUser(uid, email, name, photoUrl) {
    const docData = {
      userId: String(uid),
      createdDate: Timestamp.fromDate(new Date()),
      email: email,
      name: name, // Storing the user's name
      photoUrl: photoUrl, // Storing the user's photo URL
    };
    try {
      const docRef = await setDoc(doc(db, "users", String(uid)), docData);
    } catch (e) {
      console.error(e);
    }
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      return err.message;
    }
    return "success";
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function createClass(uid, className) {
    const classId = uuidv4();
    const docData = {
      userId: String(uid),
      className: className,
      createdDate: Timestamp.fromDate(new Date()),
      status: "live",
      classId: classId,
    };
    try {
      const docRef = await setDoc(
        doc(db, "users", uid, "classes", classId),
        docData
      );
    } catch (e) {
      console.error(e);
    }
  }
  async function createLecture(
    uid,
    classId,
    className,
    lectureName,
    abbrevDate,
    lectureId
  ) {
    const docData = {
      userId: String(uid),
      lectureName: lectureName,
      className: className,
      abbrevDate: abbrevDate,
      classId: String(classId),
      createdDate: Timestamp.fromDate(new Date()),
      status: "live",
      lectureId: String(lectureId),
    };
    try {
      const docRef = await setDoc(
        doc(db, "users", uid, "classes", classId, "lectures", lectureId),
        docData
      );
    } catch (e) {
      console.error(e);
    }
  }
  async function createNote(uid, classId, className, noteTitle) {
    const docData = {
      userId: String(uid),
      className: className,
      noteTitle: noteTitle,
      createdDate: Timestamp.fromDate(new Date()),
    };
    try {
      const docRef = await setDoc(
        doc(db, "users", uid, "classes", className, "notes", noteTitle),
        docData
      );
    } catch (e) {
      console.error(e);
    }
  }

  async function getClass(uid, className) {
    const docRef = doc(db, "users", uid, "classes", className);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("No such class!");
      return null;
    }
    return docSnap.data();
  }

  async function getNote(uid, className, noteTitle) {
    const docRef = doc(
      db,
      "users",
      uid,
      "classes",
      className,
      "notes",
      noteTitle
    );
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("No such note!");
      return null;
    }
    return docSnap.data();
  }

  async function getAllClassNames(uid) {
    const classesRef = collection(db, "users", uid, "classes");
    const querySnapshot = await getDocs(classesRef);

    const classObjects = querySnapshot.docs.map((doc) => {
      return {
        className: doc.id, // className key now holds the document ID which is the class name
        ...doc.data(), // Spreading other data that may exist in the document
      };
    });

    return classObjects;
  }

  async function getAllLectureNames(uid, classId) {
    const classesRef = collection(
      db,
      "users",
      String(uid),
      "classes",
      String(classId),
      "lectures"
    );
    const querySnapshot = await getDocs(classesRef);

    const LectureObjects = querySnapshot.docs.map((doc) => {
      return {
        ...doc.data(),
      };
    });

    return LectureObjects;
  }

  async function getAllNotes(uid, className) {
    const notesRef = collection(
      db,
      "users",
      uid,
      "classes",
      className,
      "notes"
    );
    const querySnapshot = await getDocs(notesRef);

    const notes = querySnapshot.docs.map((doc) => {
      return {
        noteTitle: doc.id,
        ...doc.data(),
      };
    });

    return notes;
  }

  async function editNotebookName(uid, classId, newname) {
    try {
      await setDoc(
        doc(db, "users", uid, "classes", classId),
        {
          className: newname,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving Item Name to Firestore: ", error);
    }
  }

  async function editLectureName(uid, classId, lectureId, newname) {
    try {
      await setDoc(
        doc(db, "users", uid, "classes", classId, "lectures", lectureId),
        {
          lectureName: newname,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving Item Name to Firestore: ", error);
    }
  }

  const value = {
    editNotebookName,
    signup,
    login,
    logout,
    resetPassword,
    createUser,
    getUser,
    uploadLectureImage,
    createClass,
    createNote,
    getClass,
    getNote,
    getAllClassNames,
    getAllNotes,
    saveNoteResponse,
    saveGptResponse,
    setNoteInfo,
    signInWithGoogle,
    deleteNotebook,
    createLecture,
    getAllLectureNames,
    deleteLecture,
    editLectureName,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
