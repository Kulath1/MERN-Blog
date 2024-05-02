import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai"
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import { app } from "../firebase"

export default function OAuth(){

    const auth = getAuth(app);
    //a function that creates the pop up  google window
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider()
        
        //to ensure that the user is always asked to choose an account everytime he signs with google
        provider.setCustomParameters({prompt: 'select_account'})

        //open the popup window
        try {
            const resultFromGoogle = await signInWithPopup(auth, provider)
            console.log(resultFromGoogle);
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