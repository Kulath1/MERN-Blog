import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute(){
    const {currentUser} = useSelector((state) => state.user)
   
    //if the currentUser exists, go to outlet, if not goes to sign in page
    return  currentUser ? <Outlet/> : <Navigate to='/sign-in' />;
    
}