import Home from "../pages/Home";
import Login from "../components/Login";
import Signup from "../components/Signup";
import ProtectedRoute from "../components/ProtectedRoute";


export const allRoutes = [
	{
		path: "",
		element: (
			<ProtectedRoute>  
        {/* Act as GATEKEEPER */}
				<Home />
			</ProtectedRoute>
		),
	},
	{ path: "login", element: <Login /> },
	{ path: "signup", element: <Signup /> },
];
