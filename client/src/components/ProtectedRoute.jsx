import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
	const { isLoggedIn, isLoading } = useContext(UserContext);
	const location = useLocation();

	if (isLoading) {
		return <Loader isLoading={isLoading} />;
	}
	if (!isLoggedIn) {
		return <Navigate to={"/login"} state={{ from: location }} replace />; 
	}

	return children; // Actual  JSX stored in children, but {children} send multiple data bundled together
};

export default ProtectedRoute;
