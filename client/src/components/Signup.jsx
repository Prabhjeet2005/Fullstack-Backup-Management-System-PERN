import React, { useContext, useEffect, useReducer, useState } from "react";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { authReducer, initialState } from "../reducers/authReducer";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import Loader from "./Loader";
import { api, ENDPOINTS } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
	const [passwordVisible, setPasswordVisible] = useState(false);
	const { name, email, password, role_name, authDispatch } =
		useContext(AuthContext);
	const { isLoading, isLoggedIn, userDispatch } = useContext(UserContext);
	const location = useLocation();
	// Location: {pathname: '/signup', search: '', hash: '', state: {…}, key: '06r14hc2'}
	const redirectPage = location?.state?.from?.pathname || "/home";
	const navigate = useNavigate();
	const handleNameChange = (e) => {
		authDispatch({
			type: "NAME_VALIDATION",
			payload: e.target.value,
		});
	};
	const handleEmailChange = (e) => {
		authDispatch({
			type: "EMAIL_VALIDATION",
			payload: e.target.value,
		});
	};
	const handlePasswordChange = (e) => {
		authDispatch({
			type: "PASSWORD_VALIDATION",
			payload: e.target.value,
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			userDispatch({
				type: "LOADING_TRUE",
			});

			if (name.isValid && email.isValid && password.isValid) {
				const signupRequest = await api.post(
					`${process.env.REACT_APP_SERVER_URL}/${ENDPOINTS.USER.SIGNUP}`,
					{
						email: email.value,
						username: name.value,
						password: password.value,
					}
				);
				if (signupRequest) {
					userDispatch({
						type: "LOGGEDIN",
					});
					toast.success("User Signned Up Successfully");
					navigate(redirectPage, { replace: true });
				}
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

	useEffect(() => {
		if(isLoggedIn){
			navigate("/home");
		}
	}, [isLoggedIn])
	
	return (
    <>
      <Container fluid>
        <Row>
          <Col
            xs={{ span: 10, offset: 1 }}
            md={{ span: 6, offset: 3 }}
            lg={{ span: 4, offset: 4 }}
          >
            <Row
              style={{ marginTop: `30vh` }}
              className="d-flex flex-column auth-container"
            >
              <Col
                style={{ color: `#008080` }}
                className="text-center auth-heading"
              >
                Signup
              </Col>
              <Col>
                <Row className="auth-field-container flex-column flex-sm-row gap-2 gap-sm-0">
                  <Col className="auth-text">Name</Col>
                  <Col
                    xs={{ span: 7 }}
                    sm={{ span: 9 }}
                    // md={{ span: 10 }}
                    className="auth-input"
                  >
                    <span className="relative">
                      {" "}
                      <input
                        className="w-100"
                        required
                        onChange={handleNameChange}
                        type="text"
                        placeholder="Enter Name"
                      />
                      <img
                        src="./images/at-sign-svgrepo-com.svg"
                        className="absolute img-auth"
                        alt="username"
                      />
                    </span>
                  </Col>
                </Row>
              </Col>
              {name?.value !== "" &&
                (name?.isValid ? (
                  <></>
                ) : (
                  <Col>
                    <Row className="password-constraints">
                      <Col
                        xs={{ span: 3, offset: 3 }}
                        sm={{ span: 9 }}
                        className="password-constraints-fields alert-error"
                      >
                        Name must be characters only
                      </Col>
                    </Row>
                  </Col>
                ))}
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
              {email?.value.length > 0 && !email?.isValid && (
                <Col>
                  <Row className="password-constraints">
                    <Col
                      xs={{ span: 3, offset: 3 }}
                      // sm={{ span: 9 }}
                      className="password-constraints-fields alert-error"
                    >
                      Email Invalid
                    </Col>
                  </Row>
                </Col>
              )}
              <Col>
                <Row className="auth-field-container flex-column flex-sm-row gap-2 gap-sm-0">
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
                        className="w-100"
                        required
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
              {password?.value !== "" && (
                <Col>
                  <Row className="password-constraints alert-error">
                    {password?.value?.length > 0 &&
                      !password?.individualValidation?.hasMinLength && (
                        <Col
                          xs={{ span: 3, offset: 3 }}
                          sm={{ span: 9 }}
                          className="password-constraints-fields"
                        >
                          Password must be 8 characters Long
                        </Col>
                      )}
                    {!password?.individualValidation?.hasUpper && (
                      <Col
                        xs={{ span: 3, offset: 3 }}
                        // sm={{ span: 9 }}
                        className="password-constraints-fields"
                      >
                        Password must have atleast 1 Uppercase
                      </Col>
                    )}
                    {!password?.individualValidation?.hasLower && (
                      <Col
                        xs={{ span: 3, offset: 3 }}
                        // sm={{ span: 9 }}
                        className="password-constraints-fields"
                      >
                        Password must have atleast 1 Lowercase
                      </Col>
                    )}
                    {!password?.individualValidation?.hasNumber && (
                      <Col
                        xs={{ span: 3, offset: 3 }}
                        // sm={{ span: 9 }}
                        className="password-constraints-fields"
                      >
                        Password must have atleast 1 Number
                      </Col>
                    )}
                    {!password?.individualValidation?.hasSpecial && (
                      <Col
                        xs={{ span: 3, offset: 3 }}
                        // sm={{ span: 9 }}
                        className="password-constraints-fields"
                      >
                        Password must have atleast 1 SpecialCharacter
                      </Col>
                    )}
                  </Row>
                </Col>
              )}
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
                  <span>Signup</span>
                )}
              </Button>
              <Col
                onClick={() => navigate("/login", { replace: true })}
                style={{ color: `#008080` }}
                className="text-center redirect "
              >
                Already A User? Login Now
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Signup;
