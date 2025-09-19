import "./App.css";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import { ToastContainer, Bounce } from "react-toastify";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/UserContext";
import { api, ENDPOINTS } from "./services/api";
import { AuthContext } from "./context/AuthContext";
import Loader from "./components/Loader";

function App() {
	const { isLoggedIn, isLoading, userDispatch } = useContext(UserContext);
	const { name, email, role_name, authDispatch } = useContext(AuthContext);

	const location = useLocation();
	const navigate = useNavigate();
	const redirectPg = location?.state?.from?.pathname || "/";

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
	}, []);

	return (
		<>
			<NavBar />
			<Loader isLoading={isLoading} />
			<ToastContainer
				position="top-center"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				limit={3}
				pauseOnFocusLoss={false}
				draggable
				pauseOnHover
				theme="colored"
				transition={Bounce}
			/>
			<Outlet />
		</>
	);
}

export default App;
