import React, { useContext, useEffect, useReducer, useState } from "react";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { authReducer, initialState } from "../reducers/authReducer";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import Loader from "./Loader";
import { api, ENDPOINTS } from "../services/api";
import { Navigate, replace, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
	const [passwordVisible, setPasswordVisible] = useState(false);
	const { email, password, role_name, authDispatch } = useContext(AuthContext);
	const { isLoading, isLoggedIn, userDispatch } = useContext(UserContext);
	const location = useLocation();
	// Location: {pathname: '/signup', search: '', hash: '', state: {…}, key: '06r14hc2'}
	const redirectPage = location?.state?.from?.pathname || "/";
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoggedIn) {
			navigate(redirectPage, { replace: true });
		}
	}, [isLoggedIn]);

	const handleEmailChange = (e) => {
		authDispatch({
			type: "EMAIL_CHANGE",
			payload: e.target.value,
		});
	};
	const handlePasswordChange = (e) => {
		authDispatch({
			type: "PASSWORD_CHANGE",
			payload: e.target.value,
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			userDispatch({
				type: "LOADING_TRUE",
			});

			const loginRequest = await api.post(
				`${process.env.REACT_APP_SERVER_URL}/${ENDPOINTS.USER.LOGIN}`,
				{
					email: email.value,
					password: password.value,
				}
			);
			if (loginRequest) {
				authDispatch({
					type: "ROLE",
					payload: loginRequest?.data?.data?.role_name,
				});
				userDispatch({
					type: "LOGGEDIN",
				});
				toast.success("User Logged In Successfully!");
				navigate(redirectPage, { replace: true });
			}
		} catch (error) {
			userDispatch({
				type: "LOADING_FALSE",
			});
			toast.error(error?.response?.data?.message || "Error  Occured!");
		} finally {
			userDispatch({
				type: "LOADING_FALSE",
			});
		}
	};
	return (
    <>
      <Container fluid>
        <Row>
          <Col xs={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }}>
            <Row
              style={{ marginTop: `30vh` }}
              className="d-flex flex-column auth-container"
            >
              <Col
                style={{ color: `#008080` }}
                className="text-center auth-heading"
              >
                Login
              </Col>

              <Col>
                <Row className="auth-field-container flex-column flex-sm-row gap-2 gap-sm-0">
                  <Col className="auth-text">Email</Col>
                  <Col
                    xs={{ span: 7 }}
                    sm={{ span: 9 }}
                    // md={{ span: 10 }}
                    className="auth-input relative"
                  >
                    <span className="relative">
                      {" "}
                      <input
											className="w-100"
                        required
                        onChange={handleEmailChange}
                        type="text"
                        placeholder="Enter Email"
                      />
                      <img
                        src="./images/email-8-svgrepo-com (1).svg"
                        className="absolute img-auth"
                        alt="username"
                      />
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row className="auth-field-container  flex-column flex-sm-row gap-2 gap-sm-0">
                  <Col className="auth-text">Password</Col>
                  <Col
                    xs={{ span: 7 }}
                    sm={{ span: 9 }}
                    // md={{ span: 10 }}
                    className="auth-input relative"
                  >
                    <span className="relative">
                      {" "}
                      <input
                        required
												className="w-100"
                        onChange={handlePasswordChange}
                        type={passwordVisible ? `text` : `password`}
                        placeholder="Enter Password"
                      />
                      <img
                        onClick={(e) =>
                          setPasswordVisible(!passwordVisible)
                        }
                        src={
                          passwordVisible
                            ? "./images/eye-open-svgrepo-com.svg"
                            : "./images/eye-close-svgrepo-com.svg"
                        }
                        className="absolute img-auth"
                        alt="password"
                      />
                    </span>
                  </Col>
                </Row>
              </Col>
              <Button
                disabled={isLoading}
                onClick={handleSubmit}
                className={`auth-btn ${isLoading && "btn-loading"}`}
              >
                {isLoading ? (
                  <img
                    className="img-loader-btn"
                    src="./images/block-2-svgrepo-com (1).svg"
                    alt="disabled img"
                  />
                ) : (
                  <span>Login</span>
                )}
              </Button>
              <Col
                onClick={() => navigate("/signup", { replace: true })}
                style={{ color: `#008080` }}
                className="text-center redirect "
              >
                Not A User? Signup Now
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
