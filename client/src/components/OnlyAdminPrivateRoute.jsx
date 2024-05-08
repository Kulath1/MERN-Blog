import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function OnlyAdminPrivateRoute(){
    const {currentUser} = useSelector((state) => state.user)
   
    //if the currentUser is the admin, go to outlet, if not goes to sign in page
    return  currentUser && currentUser.isAdmin ? <Outlet/> : <Navigate to='/sign-in' />;
    
}