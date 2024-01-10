import { db } from "../firebase";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Study from "./Study";
import Auth from "./Auth";
import Lecture from "./Lecture";

function App() {
  return (
    <>
      <Container
        fluid
        style={{
          padding: "0",
        }}
      >
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Study />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/lecture" element={<Lecture />} />
            </Routes>
          </AuthProvider>
        </Router>
      </Container>
    </>
  );
}

export default App;

//hi
