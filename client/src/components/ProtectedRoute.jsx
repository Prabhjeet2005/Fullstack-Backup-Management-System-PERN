import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
	const { isLoggedIn, isLoading } = useContext(UserContext);
	const location = useLocation();
	const navigate = useNavigate()
	useEffect(() => {
		if (isLoading) {
			return <Loader isLoading={isLoading} />;
		}
		if (!isLoggedIn) {
			navigate("/login",{state:{from:location}})
		}
		
	}, [isLoggedIn])
	

	return children; // Actual  JSX stored in children, but {children} send multiple data bundled together
};

export default ProtectedRoute;
