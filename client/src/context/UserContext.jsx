import { createContext, useReducer } from "react";
import {userReducer} from "../reducers/userReducer.js"

const initialState = {
  isLoggedIn:false,
  isLoading:false,
}

export const UserContext = createContext(initialState);

export const UserContextProvider = ({children})=>{
  const [{isLoggedIn,isLoading}, userDispatch] = useReducer(userReducer,initialState);
  return(
    <UserContext.Provider value={{isLoading,isLoggedIn,userDispatch}} >
      {children}
    </UserContext.Provider>
  )
}