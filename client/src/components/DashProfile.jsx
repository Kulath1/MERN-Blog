import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import {useSelector} from 'react-redux';
import {getStorage} from 'firebase/storage'
import {app} from '../firebase'
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile(){
    const {currentUser} = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);

    //create a reference to choose a file for the profile image
    const filePickerRef = useRef();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            //choose a new profile image
            setImageFile(file);
            //change the current image url to new image url
            setImageFileUrl(URL.createObjectURL(file));  
        }
    };
    //uploading the new image
    useEffect(() => {
        if(imageFile){
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        // Craft rules based on data in your Firestore database
        // allow write: if firestore.get(
        //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
        //service firebase.storage {
            //match /b/{bucket}/o {
            //match /{allPaths=**} {
                //allow read;
                //allow write: if
                //request.resource.size < 2 * 1024 *1024 &&
                //request.resource.contentType.matches("image/.*")
            //}
         //}
    //}
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName =new Date().getTime() + imageFile.name; //adding the time of the image upload so that image has a unique name
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        //obtain info about the image uploading
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred/ snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0)); //toFixed is used to roundoff decimail numbers
            }, 
            (error) => {
                setImageFileUploadError("Couldn't upload error (File must be less than 2MB)");
                setImageFileUploadProgress(null); // stop showing the uploading progress when there's an error uploading
                setImageFileUrl(null);
                setImageFile(null);
            },
            //get the url of the upoaded image
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                })
            }

        )
    }
    return (
        <div className='max-w-lg mx-auto w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4'>
                <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
                <div className=' relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>filePickerRef.current.click()}>
                    {/* add a circular progress bar to depict the image uploading */}
                    {imageFileUploadProgress && (
                        <CircularProgressbar 
                            value={imageFileUploadProgress || 0} 
                            text={`${imageFileUploadProgress}%`} 
                            strokeWidth={5} 
                            styles={
                                {root: { 
                                    width: '100%', 
                                    height: '100%', 
                                    position: 'absolute', 
                                    top: 0, 
                                    left: 0, 
                                }, 
                                path: { 
                                    stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`, // increases the opacity of the color with loading
                                },
                            }}/>
                    )}
                    <img src={imageFileUrl || currentUser.profilePicture} alt='user' 
                    className={
                        `rounded-full w-full h-full object-cover border-8 border-[#8f979a65] 
                        ${imageFileUploadProgress && imageFileUploadProgress<100 && 'opacity-60'}` // keep an opacity of 60 on the image until it's 100% loaded
                    }/>
                </div>
                {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
                <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username}/>
                <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email}/>
                <TextInput type='password' id='password' placeholder='********'/>
                <Button type='submit' gradientDuoTone="purpleToBlue" outline> Update </Button>
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>

        </div>
    )
}