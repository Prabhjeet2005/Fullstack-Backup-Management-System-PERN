import React, { useContext, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "./NavBar.css";
import { UserContext } from "../context/UserContext";
import { api, ENDPOINTS } from "../services/api";
import { toast } from "react-toastify";

const NavBar = () => {
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const { isLoggedIn, isLoading, userDispatch } = useContext(UserContext);
	const navigate = useNavigate();
	const location = useLocation();
	const redirectPage = location?.state?.from?.pathname || "/";

	const handleLoginClick = (e) => {
		navigate("/login",{state:{from:location}})
	};
	const handleSignupClick = (e) => {
		navigate("/signup", { state: { from: location } });

	};
	const handleLogoutClick = async (e) => {
		try {
			userDispatch({
				type: "LOADING_TRUE",
			});

			const logoutRequest = await api.get(
				`${process.env.REACT_APP_SERVER_URL}/${ENDPOINTS.USER.LOGOUT}`
			);
			if (logoutRequest) {
				userDispatch({
					type: "LOGGEDOUT",
				});
				toast.success("Logged Out Successfully!");
				navigate(redirectPage, { replace: true });
			}
		} catch (error) {
			userDispatch({
				type: "LOADING_FALSE",
			});
			toast.error(error?.response?.data?.message || "Error Occured!");
		} finally {
			userDispatch({
				type: "LOADING_FALSE",
			});
		}
	};
	return (
		<Container fluid className="key-element p-2  ">
			<Row className="d-flex justify-content-between align-items-center">
				<Col onClick={(e) => navigate("/")} className="logo-text text-warning">
					<span>
						InstaBackUp
						<img src="./images/logo.svg" className="img-size-no-scale" alt="logo" />{" "}
					</span>
				</Col>
				<Col className="d-flex profile-container flex-row-reverse relative">
					<img
						onClick={(e) => setIsProfileOpen(!isProfileOpen)}
						src="/images/profile-circle-svgrepo-com.svg"
						alt="Login/Logout"
						className="img-size flip-horizontal coin-flip-effect"
					/>
					{isProfileOpen ? (
						<>
							<Container
								fluid
								className="absolute profile d-flex justify-content-end ">
								<Row className="d-flex flex-column">
									{isLoggedIn ? (
										<Col
											onClick={handleLogoutClick}
											className="profile-btn logout d-flex align-items-center">
											Logout
										</Col>
									) : (
										<>
											<Col className="profile-btn" onClick={handleLoginClick}>
												Login
											</Col>
											<Col className="profile-btn" onClick={handleSignupClick}>
												Signup
											</Col>
										</>
									)}
								</Row>
							</Container>
						</>
					) : (
						<></>
					)}
				</Col>
			</Row>
		</Container>
	);
};

export default NavBar;
