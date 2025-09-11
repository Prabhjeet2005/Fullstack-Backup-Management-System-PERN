import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { allRoutes } from "./utils/allRoutes";
import "./index.css";
import { UserContextProvider } from "./context/UserContext";
import { AuthContextProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

const routes = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: allRoutes,
	},
]);
root.render(
	<UserContextProvider>
		<AuthContextProvider>
			<React.StrictMode>
				<RouterProvider router={routes}>
					<App />
				</RouterProvider>
			</React.StrictMode>
		</AuthContextProvider>
	</UserContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
