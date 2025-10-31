import React, { useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import { api, ENDPOINTS } from "../services/api";

const LandingPg = () => {
  const features = [
    {
      icon: "/LandingPg/clock-svgrepo-com.svg",
      heading: "Automated Backups",
      description:
        "Schedule backups automatically with customizable intervals. Never worry about manual backups again.",
    },
    {
      icon: "/LandingPg/shield-svgrepo-com.svg",
      heading: "Encrypted",
      description:
        "End-to-end encryption with AES-256 ensures your data is always protected at rest and in transit.",
    },
    {
      icon: "/LandingPg/database-svgrepo-com.svg",
      heading: "PostgreSQL Optimized",
      description:
        "Built specifically for PostgreSQL with features like pg_dump and backups downloading.",
    },
    {
      icon: "/LandingPg/users-svgrepo-com.svg",
      heading: "Role Based Access",
      description:
        "Granular permissions for Admins and Auditors. Control who can backup, restore, or view audit logs.",
    },
  ];
  const roleFeatures = [
    {
      icon: "/LandingPg/shield-svgrepo-com.svg",
      roleName: "Administrator",
      control: "Full system control",
      description:
        "Complete control over backup operations, configurations, and system management. Perfect for database administrators and DevOps teams.",
      features: [
        "Full backup configuration and scheduling",
        "Create, modify, and delete backup policies",
        "Database connection management",
        "Restore database from backups",
        "Access to all system settings",
      ],
    },
    {
      icon: "/images/eye-open-svgrepo-com.svg",
      roleName: "Auditor",
      control: "Read Only Oversight",
      description:
        "Comprehensive visibility into backup operations without modification privileges.",
      features: [
        "View all backup operations and history",
        "Access comprehensive audit logs",
        "Generate compliance reports",
        "View storage usage analytics",
        "Read-only access to configurations",
      ],
    },
  ];
  const navigate = useNavigate()
  const {userDispatch,isLoggedIn} = useContext(UserContext)
  const {authDispatch} = useContext(AuthContext)
  useEffect(() => {
    (async () => {
      if (!isLoggedIn) {
        try {
          userDispatch({
            type: "LOADING_TRUE",
          });
          const checkCookieStored = await api.post(
            `${process.env.REACT_APP_SERVER_URL}/${ENDPOINTS.USER.LOGINTOKEN}`
          );
          if (checkCookieStored?.data?.success === true) {
            authDispatch({
              type: "NAME_VALIDATION",
              payload: checkCookieStored.data.data.username,
            });
            authDispatch({
              type: "EMAIL_CHANGE",
              payload: checkCookieStored.data.data.email,
            });
            authDispatch({
              type: "ROLE",
              payload: checkCookieStored.data.data.role_name,
            });
            userDispatch({
              type: "LOGGEDIN",
            });
          }
        } catch (error) {
          console.error(error);
        } finally {
          userDispatch({
            type: "LOADING_FALSE",
          });
        }
      }
    })();
    if(isLoggedIn){
      navigate("/home")
    }
  }, [isLoggedIn]);
  
  
  return (
    <div
      style={{ marginTop: "5em" }}
      className="pt-3 d-flex flex-column gap-5 position-relative px-3 px-sm-5"
    >
      <img
        className="position-fixed opacity-25"
        style={{
          zIndex: "-1",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
        src="/secure-bg.svg"
        alt="image"
      />
      <div
        className="position-absolute rounded-circle"
        style={{
          zIndex: "-2",
          width: "50em",
          height: "50em",
          backgroundColor: "#E1EFEF",
          left: "-30em",
          top: "-30em",
        }}
      ></div>
      <div
        className="position-absolute rounded-circle"
        style={{
          zIndex: "-2",
          width: "50em",
          height: "50em",
          backgroundColor: "#E1EFEF",
          right: "-30em",
          top: "30em",
        }}
      ></div>
      <div
        style={{ minHeight: "28em", paddingTop: "10%" }}
        className="d-flex flex-column gap-4 mt-3 align-items-center"
      >
        <div className="text-black fw-normal fs-1">
          Database Backup Solution
        </div>
        <div className="text-center px-5">
          Automated PostgreSQL backup management with role-based access
          control. Secure your data with military-grade encryption and
          real-time monitoring.
        </div>
        <Link to={"/login"}>
          <Button
            style={{ backgroundColor: `#008080` }}
            className="border border-0"
          >
            Explore <ArrowRight className="text-white" />
          </Button>
        </Link>
      </div>
      <div>
        <div className="d-flex justify-content-center">
          <span
            style={{ backgroundColor: "#E1EFEF", color: "#008080" }}
            className="py-1 px-3 rounded-5 fs-6"
          >
            Features
          </span>
        </div>
        <div className="text-black fw-normal text-center fs-1">
          Everything You Need for Backup Management
        </div>
        <div className="text-center mt-3 mb-5">
          Comprehensive features designed to protect your data and
          streamline operations.
        </div>
        <div className="d-flex justify-content-center align-items-center flex-sm-row flex-sm-wrap flex-column gap-2">
          {features.map((feature, index) => (
            <>
              <div
                style={{
                  width: "20em",
                  backgroundColor: "transparent",
                  height: "18em",
                  border: "1px solid lightgray",
                }}
                className="d-flex flex-column align-items-center p-2 py-4 rounded-4 gap-3 mb-4"
              >
                <div
                  className="p-2 rounded"
                  style={{
                    backgroundColor: "#E1EFEF",
                    width: "3em",
                    height: "3em",
                  }}
                >
                  <img
                    style={{ width: "2em", height: "2em" }}
                    src={feature.icon}
                    alt="card-icon"
                  />
                </div>
                <div className="fw-semibold">{feature.heading}</div>
                <div className="text-center">{feature.description}</div>
              </div>
            </>
          ))}
        </div>
      </div>

      <div>
        <div className="d-flex justify-content-center">
          <span
            style={{ backgroundColor: "#E1EFEF", color: "#008080" }}
            className="py-1 px-3 rounded-5 fs-6"
          >
            Role-Based Access
          </span>
        </div>
        <div className="text-black text-center fw-normal fs-1">
          Two Powerful Roles
        </div>
        <div className="text-center mt-3 mb-5">
          Designed for security and compliance with distinct permissions
          for Admins and Auditors.
        </div>
        <div className="d-flex align-items-sm-start justify-content-center align-items-center flex-sm-row flex-sm-wrap flex-column gap-5">
          {roleFeatures.map((roleFeature, index) => (
            <>
              <div
                style={{
                  width: "20em",
                  height: "28em",
                  border: "1px solid lightgray",
                }}
                className="d-flex flex-column align-items-center p-2 py-4 border rounded-4 gap-3 mb-4"
              >
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="p-2 rounded"
                    style={{
                      backgroundColor: "#E1EFEF",
                      width: "3em",
                      height: "3em",
                      border: "1px solid #008080",
                    }}
                  >
                    <img
                      style={{ width: "2em", height: "2em" }}
                      src={roleFeature.icon}
                      alt="card-icon"
                    />
                  </div>
                  <div className="mx-2">
                    <div className="fw-semibold fs-5">
                      {roleFeature.roleName}
                    </div>
                    <div className="fs-6 fw-light">
                      {roleFeature.control}
                    </div>
                  </div>
                </div>
                <div
                  className="px-4 fw-light"
                  style={{ fontSize: "small" }}
                >
                  {roleFeature.description}
                </div>
                <div>
                  {roleFeature.features.map((feature, index) => (
                    <div
                      style={{ fontSize: "small" }}
                      className="d-flex mb-2 gap-2 px-3"
                    >
                      <img
                        style={{ width: "1.5em", height: "1.5em" }}
                        className=""
                        src="/LandingPg/tick-svgrepo-com.svg"
                        alt="tick"
                      />
                      <div>{feature}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPg;
