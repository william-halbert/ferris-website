import React, { useState } from "react";
import Header from "./HeaderLanding";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Checkout from "./Checkout";

export default function MyCredits() {
  const [amount, setAmount] = useState(5);
  return (
    <>
      <Header />
      <div style={{ margin: "14vh 5vw" }}>
        <div
          style={{
            borderRadius: "15px",
            padding: "36px",
            maxWidth: "60vw",
            margin: "0 auto",
            boxShadow: "1px 1px 15px rgba(0,123,255, .4)",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
            }}
          >
            Your Profile
          </h1>
          <h1
            style={{
              fontSize: "28px",
            }}
          >
            <span
              style={{
                color: "#007BFF",
              }}
            >
              $3.84
            </span>{" "}
            of credits remaining
          </h1>
          <h2
            style={{
              fontSize: "36px",
              marginTop: "64px",
            }}
          >
            Add credits
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <select
                style={{
                  padding: " 10px",
                  borderRadius: "15px",
                  fontSize: "28px",
                  marginRight: "36px",
                  minWidth: "200px",
                }}
                placeholder="$10"
                type=""
                onChange={(e) => setAmount(Number(e.target.value))}
              >
                {" "}
                <option value="5">$5</option>
                <option value="10">$10</option>
                <option value="20">$20</option>
                <option value="30">$30</option>
              </select>

              <Checkout amount={amount} />
            </div>
          </div>
        </div>
        <div
          style={{
            borderRadius: "15px",
            padding: "36px",
            maxWidth: "60vw",
            margin: "0 auto",
            boxShadow: "1px 1px 15px rgba(160,96,255, .4)",
            marginTop: "8vh",
          }}
        >
          <h2
            style={{
              fontSize: "44px",
            }}
          >
            Usage Summary
          </h2>
          <div style={{ marginBottom: "20px" }}>
            <h3>14 Transcriptions</h3>
            <h3>209 Questions</h3>
          </div>

          <h2
            style={{
              marginTop: "8vh",
              fontSize: "44px",
            }}
          >
            Usage History
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <h3>Date</h3>
            <h3>Type</h3>
            <h3>Usage</h3>
            <h3>Charge</h3>
          </div>
        </div>
      </div>
    </>
  );
}
