import { useReducer } from "react";
import {
	emailRegex,
	lowercaseRegex,
	nameRegex,
	numberRegex,
	specialCharRegex,
	uppercaseRegex,
} from "../utils/regex";

export const initialState = {
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
};

export const authReducer = (state, { type, payload }) => {
	switch (type) {
		case "PASSWORD_CHANGE":
			return {...state,password:{value:payload}};
		case "EMAIL_CHANGE":
			return {...state,email:{value:payload}};
		case "NAME_VALIDATION":
			return {
				...state,
				name: { value: payload, isValid: nameRegex.test(payload) },
			};
		case "EMAIL_VALIDATION":
			return {
				...state,
				email: { value: payload, isValid: emailRegex.test(payload) },
			};
		case "PASSWORD_VALIDATION":
			return {
				...state,
				password: {
					value: payload,
					isValid:
						uppercaseRegex.test(payload) &&
						lowercaseRegex.test(payload) &&
						specialCharRegex.test(payload) &&
						payload.length >= 8 &&
						numberRegex.test(payload),
					individualValidation: {
						hasUpper: uppercaseRegex.test(payload),
						hasLower: lowercaseRegex.test(payload),
						hasSpecial: specialCharRegex.test(payload),
						hasMinLength: payload.length >= 8,
						hasNumber: numberRegex.test(payload),
					},
				},
			};
		default:
			return state;
	}
};
