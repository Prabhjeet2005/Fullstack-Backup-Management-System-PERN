import axios from "axios"

const serverURL = process.env.REACT_APP_ENV === "development" ?"http://localhost:7000" :process.env.REACT_APP_SERVER_URL

export const api = axios.create({
	baseURL: serverURL,
  withCredentials:true
});

export const ENDPOINTS = {
  USER: {
    SIGNUP: "api/auth/signup",
    LOGIN: "api/auth/login",
    LOGINTOKEN: "api/auth/login-with-token",
    LOGOUT: "api/auth/logout",
  },
  BACKUP: {
    CREATE: "api/backups",
    FETCH: "api/backups",
    DELETE: "api/backups/:id/delete",
    DOWNLOAD: "api/backups/:id/download",
  },
  SCHEDULES: {
    FETCH: "api/schedule-auto-backup",
    CREATE: "api/schedule-auto-backup",
  },
};