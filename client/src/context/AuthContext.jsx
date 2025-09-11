import { createContext, useReducer } from "react";
import { authReducer } from "../reducers/authReducer";

const initialState = {
	name: { value: "", isValid: false },
	email: { value: "", isValid: false },
	password: {
		value: "",
		isValid: false,
		individualValidation: {
			hasUpper: false,
			hasLower: false,
			hasNumber: false,
			hasSpecial: false,
			hasMinLength: false,
		},
	},
	role_name: "",
};

export const AuthContext = createContext(initialState);

export const AuthContextProvider = ({ children }) => {
	const [{ name, email, password, role_name }, authDispatch] = useReducer(
		authReducer,
		initialState
	);

	return (
		<AuthContext.Provider
			value={{
				name,
				email,
				password,
				role_name,
				authDispatch,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
