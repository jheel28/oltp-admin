import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

const LandingPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #1890ff 0%, #001529 100%)",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "2rem",
          color: "white",
        }}
      >
        Welcome to Beta Classes
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          marginBottom: "3rem",
          opacity: 0.8,
        }}
      >
        Your gateway to academic excellence. Sign in or Register to continue.
      </p>
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/auth/sign-in">
          <Button
            type="primary"
            size="large"
            shape="round"
            style={{ width: "150px", height: "50px", fontSize: "1.1rem" }}
          >
            Login
          </Button>
        </Link>
        <Link to="/auth/register/student">
          <Button
            size="large"
            shape="round"
            ghost
            style={{
              width: "150px",
              height: "50px",
              fontSize: "1.1rem",
              borderColor: "white",
              color: "white",
            }}
          >
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
