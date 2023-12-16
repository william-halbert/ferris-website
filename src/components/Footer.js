import React from "react";
import { Link } from "react-router-dom";
import Logo from "../images/logo.png";
import "font-awesome/css/font-awesome.min.css";
import "./Footer.css";

export default function Footer() {
  const styles = {
    footerContainer: {
      display: "flex",
      justifyContent: "space-between",
      padding: "5vh 5vw",
      background:
        "linear-gradient(45deg, hsla(312, 100%, 89%, 1) 0%, hsla(335, 100%, 50%, 1) 100%)",
    },
    footerLeft: {
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
    },
    footerLogo: {
      width: "250px",
      marginBottom: "10px",
    },
    gradient: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    footerInstagramIcon: {
      color: "white",
      fontSize: "36px",
    },
    footerRight: {
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
    },
    footerLink: {
      color: "white",
      textDecoration: "none",
      marginBottom: "10px",
      cursor: "pointer",
      textAlign: "left",
    },
    footerLinkHover: {
      textDecoration: "underline",
    },
  };

  return (
    <footer style={styles.footerContainer}>
      <div style={styles.footerLeft}>
        <img
          className="footer-logo"
          src={Logo}
          alt="AudioChat.ai Logo"
          style={styles.footerLogo}
        />
        <div style={{ padding: "0 12px" }}>
          <a
            href="https://www.instagram.com/ferris.so/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="fa fa-instagram"
              style={styles.footerInstagramIcon}
            ></i>
          </a>
        </div>
        <p
          className="footer-link"
          style={{ marginLeft: "12px", color: "white" }}
        >
          tryFerris@gmail.com
        </p>
      </div>
      <div style={styles.footerRight}>
        <Link
          className="footer-link"
          to="/privacy-policy"
          style={styles.footerLink}
        >
          Privacy Policy
        </Link>
        <Link
          className="footer-link"
          to="/terms-and-conditions"
          style={styles.footerLink}
        >
          Terms and Conditions
        </Link>
      </div>
    </footer>
  );
}
