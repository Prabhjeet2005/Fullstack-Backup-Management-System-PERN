export const userReducer = (state,{type,payload})=>{
  switch (type) {
    case "LOADING_TRUE":
      return {...state,isLoading:true};
    case "LOADING_FALSE":
      return {...state,isLoading:false};
    case "LOGGEDIN":
      return { ...state, isLoggedIn: true };
    case "LOGGEDOUT":
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
}