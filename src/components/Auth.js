import React, { useState, useEffect } from "react";
import "./Auth.css";
import convertibleBackground from "../images/convertible.png";
import googleLogo from "../images/google.png";
import { useAuth } from "../contexts/AuthContext";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Dropdown,
  Modal,
} from "react-bootstrap";
import { Card, Form, Button, Alert } from "react-bootstrap";

export default function Auth() {
  const { signInWithGoogle, login, signup, resetPassword } = useAuth();
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const auth = getAuth();
  const user = auth.currentUser;
  const [authStep, setAuthStep] = useState("email"); // New state to track auth steps
  const [email, setEmail] = useState(""); // State to hold the email
  const [password, setPassword] = useState(""); // State to hold the password
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const containerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${convertibleBackground})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)", // Blur effect
  };

  useEffect(() => {
    async function authorize() {
      if (user) {
        navigate("/"); // Navigate to the home route on success
      }
    }
    authorize();
  }, []);
  const handleGoogleSignIn = async () => {
    console.log("Attempting to sign in with Google");
    const response = await signInWithGoogle();
    if (response.success) {
      // Successfully signed in
      console.log("success");
      navigate("/"); // Navigate to the home route on success
    } else {
      // Error occurred
      console.error(response.errorMessage);
      // Display an error message
    }
  };
  const handleEmailContinue = () => {
    setAuthStep("password"); // Reset the auth step to email
  };

  const handleBack = () => {
    setAuthStep("email"); // Reset the auth step to email
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    //console.log("Email: ", email, "Password: ", password);
    try {
      handleSignUp();
      console.log("signed up");
      setTimeout(async () => {
        try {
          await handleLogin();
          console.log("logged in");
        } catch (loginError) {
          console.log("loginError", loginError);
        }
      }, 1000);
    } catch (signUpError) {
      console.log("signUpError", signUpError);
      try {
        handleLogin();
        console.log("logged in");
      } catch (loginError) {
        console.log("loginError", loginError);
      }
    }
  };

  async function handleLogin() {
    try {
      setError("");
      const response = await login(email, password);
      if (response != "success") {
        return setError(response);
      } else {
        navigate("/");
        setSuccess("You're logged in!");
      }
    } catch (err) {
      console.log(err);
      setError(err);
    }
  }
  async function handleSignUp() {
    try {
      setError("");
      const response = await signup(email, password);
      if (response != "success") {
        return setError(response);
      } else {
        navigate("/");
        return setSuccess("You're signed up!");
      }
    } catch (err) {
      console.log(err);
      setError(err);
    }
  }
  async function handleReset(e) {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const response = await resetPassword(email);
      if (response != "success") {
        return setError(response);
      } else {
        setSuccess("Check your email for further instructions.");
      }
    } catch (err) {
      console.log(err);
      setError("Failed to reset password.");
    }
  }
  return (
    <div className="auth-container" style={containerStyle}>
      <div className="auth-modal">
        {authStep === "email" && (
          <>
            <h2 className="WelcomeBack">Welcome back!</h2>
            <button onClick={handleGoogleSignIn} className="auth-google-btn">
              <img src={googleLogo} alt="Google logo" className="google-logo" />
              Continue with Google
            </button>
            <button className="auth-alt-btn" onClick={handleEmailContinue}>
              Continue with email
            </button>
            <div className="auth-terms">
              By continuing, you agree to Ferris's{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevent the default anchor tag behavior
                  window.open(
                    "https://ferris.so/terms-and-conditions",
                    "_blank"
                  ); // Open the URL in a new window
                }}
              >
                Terms of Use
              </a>
              . Read our{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevent the default anchor tag behavior
                  window.open("https://ferris.so/privacy-policy", "_blank"); // Open the URL in a new window
                }}
              >
                Privacy Policy
              </a>
              .
            </div>
          </>
        )}
        {authStep === "password" && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                width: "100%", // Ensure the container is full-width
                minHeight: "46px",
              }}
            >
              <button onClick={handleBack} className="back-button">
                {"<"}
              </button>
              <h2 className="h2-email" style={{ alignSelf: "end" }}>
                Continue with email
              </h2>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <label for="email-input" className="email-label">
              Email (personal or work)
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              placeholder="julie@example.com"
              className="auth-input email-input"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label for="password-input" className="email-label">
              Password
            </label>
            <input
              type="password"
              id="password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="auth-input password-input"
            />
            <button onClick={handlePasswordSubmit} className="continue-btn">
              Continue
            </button>
            <button className="auth-alt-btn" onClick={handleReset}>
              Forgot password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
