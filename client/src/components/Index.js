import React, { useRef, useState } from "react";
import Header from "./HeaderIndex";
import HeroImg from "../images/transcribe.png";
import demoVideo from "../images/demo.mov";
import { getAuth } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { getDatabase } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert } from "react-bootstrap";

export default function Index() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  return (
    <>
      <Header />
      <div style={{ marginTop: "86px", marginBottom: "20vh" }}>
        {/* Hero section */}
        <section style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ alignSelf: "center", marginLeft: "5vw" }}>
            <h1 style={{ fontSize: "84px" }}>
              Transcribe audio then chat with it
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                justifyContent: "start",
              }}
            >
              <button
                style={{
                  fontSize: "30px",
                  padding: "5px 0px",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  borderRadius: "50px",
                  border: "none",
                  cursor: "pointer",
                  minWidth: "200px",
                  minHeight: "unset",
                }}
                onClick={() => {
                  if (user) {
                    navigate("/chat");
                  } else {
                    navigate("/signup");
                  }
                }}
              >
                Get Started
              </button>
              <h2
                style={{
                  fontSize: "30px",
                  padding: "10px 20px",
                  backgroundColor: "#fff",
                  color: "#007BFF",
                  borderRadius: "8px",
                  border: "none",
                }}
              >
                See demos below
              </h2>
            </div>
          </div>
          <img
            src={HeroImg}
            alt="Hero"
            style={{ maxHeight: "80vh", marginRight: "5vw" }}
          />
        </section>

        {/* 1st demo section */}
        <section
          style={{
            marginTop: "15vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "42px",
              alignSelf: "start",
              marginLeft: "5vw",
            }}
          >
            Students
          </h2>
          <h3
            style={{
              fontSize: "30px",
              alignSelf: "start",
              marginLeft: "5vw",
              marginBottom: "10vh",
              maxWidth: "90vw",
            }}
          >
            Ask about class topics or even ask what homework was assigned
          </h3>
          <video
            src={demoVideo}
            style={{
              maxWidth: "90vw",
              borderRadius: "15px",
              boxShadow: "1px 1px 6px rgba(0,123,255, .8)",
            }}
            autoPlay
            loop
            muted
          />
        </section>
      </div>
    </>
  );
}
