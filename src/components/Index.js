import React, { useRef, useState } from "react";
import Header from "./HeaderLanding";

import convertible from "../images/convertible.png";
import camera from "../images/camera.png";
import arrow from "../images/arrow.gif";
import notes from "../images/notes.jpg";

import "./Index.css";

import { getAuth } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { getDatabase } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert, Modal } from "react-bootstrap";
import Footer from "./Footer";

export default function Index() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div
        style={{ marginTop: "86px", marginBottom: "20vh", textAlign: "center" }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            margin: "24px 0",
          }}
        >
          <img
            src={convertible}
            alt="Convertible"
            style={{
              maxWidth: "100%",
              objectFit: "cover",
              height: "80vh",
              width: "80vw",
              borderRadius: "48px",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "black",
              fontWeight: "bold",
            }}
            className="hero-text"
          >
            <h1 className="ntr hero-text-h1" style={{ fontSize: "48px" }}>
              Take photos, take notes
            </h1>
            <h3
              className="ntr hero-text-h3"
              style={{ width: "70vw", fontSize: "32px" }}
            ></h3>
          </div>
          <div
            style={{
              position: "absolute",
              top: "80%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "black",
              fontWeight: "bold",
            }}
            className="hero-text"
          >
            <h1
              className="ntr hero-button"
              style={{
                fontSize: "80px",
                background: "rgba(255,255,255,.7)",
                padding: "10px 20px",
                borderRadius: "10px",
              }}
              onClick={() => {
                window.open("https://study.ferris.so", "_blank");
              }}
            >
              Study
            </h1>
          </div>
        </div>

        <div
          style={{
            margin: "5vh 15vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="column-mobile demo-camera"
        >
          <div
            style={{
              position: "relative", // Add this
              width: "25vw",
              height: "85vh",
              borderRadius: "24px",
              overflow: "hidden", // To ensure the image doesn't spill out if it exceeds the div
            }}
            className="index-camera"
          >
            <img
              src={camera}
              alt="Left Image"
              style={{
                position: "absolute", // Add this
                top: 0, // Add this
                left: 0, // Add this
                width: "100%", // Modify this
                height: "100%", // Add this
                objectFit: "cover",
              }}
            />
          </div>

          <img
            src={arrow}
            alt="Arrow"
            className="index-arrow"
            style={{ margin: "0", width: "20vw", height: "200px" }}
          />

          <div
            style={{
              position: "relative", // Add this
              width: "24vw",
              height: "85vh",
              borderRadius: "24px",
              overflow: "hidden", // To ensure the image doesn't spill out if it exceeds the div
            }}
            className="index-image-to-text"
          >
            <img
              src={notes}
              alt="Right Image"
              style={{
                position: "absolute", // Add this
                top: 0, // Add this
                left: 0, // Add this
                width: "100%", // Modify this
                height: "100%", // Add this
                objectFit: "cover",
                borderRadius: "24px",
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
