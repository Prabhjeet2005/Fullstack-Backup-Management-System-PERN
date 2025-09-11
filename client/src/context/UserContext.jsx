import { createContext, useReducer } from "react";
import {userReducer} from "../reducers/userReducer.js"

const initialState = {
  isLoggedIn:false,
  isLoading:false,
}

export const UserContext = createContext(initialState);

export const UserContextProvider = ({children})=>{
  const [{isLoggedIn,isLoading,role_name}, userDispatch] = useReducer(userReducer,initialState);
  return(
    <UserContext.Provider value={{isLoading,isLoggedIn,role_name,userDispatch}} >
      {children}
    </UserContext.Provider>
  )
}