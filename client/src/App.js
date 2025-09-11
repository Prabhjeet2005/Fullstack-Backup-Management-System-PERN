import "./App.css";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import { ToastContainer,Bounce } from "react-toastify";

function App() {
	return (
		<>
			<NavBar />
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
