import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai"
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import { app } from "../firebase"
import {useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {signInSuccess} from '../redux/user/userSlice';

export default function OAuth(){

    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    //a function that creates the pop up  google window
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider()
        
        //to ensure that the user is always asked to choose an account everytime he signs with google
        provider.setCustomParameters({prompt: 'select_account'})

        //open the popup window
        try {
            const resultFromGoogle = await signInWithPopup(auth, provider)
            
            //sending signin information to the backend
            const res = await fetch('api/auth/google', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: resultFromGoogle.user.displayName,
                    email: resultFromGoogle.user.email,
                    googlePhotoUrl: resultFromGoogle.user.photoURL,
                }),
            })
            //convert the result to json
            const data = await res.json()
            if(res.ok){
                dispatch(signInSuccess(data));
                navigate('/');
            }
        }catch(error){
            console.log(error);
        }

    }
    return (
        <Button type="button" gradientDuoTone="pinkToOrange" outline onClick={handleGoogleClick}>
            <AiFillGoogleCircle className="w-6 h-6 mr-2"/>
            Continue with Google
        </Button>
    )}