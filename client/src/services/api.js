import axios from "axios"

export const api = axios.create({
	baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials:true
});

export const ENDPOINTS = {
	USER: {
		SIGNUP: "api/auth/signup",
		LOGIN: "api/auth/login",
		LOGINTOKEN: "api/auth/login-with-token",
		LOGOUT: "api/auth/logout",
	},
};