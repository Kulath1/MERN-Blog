import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import {useSelector} from 'react-redux';
import {getStorage} from 'firebase/storage'
import {app} from '../firebase'
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function DashProfile(){
    const {currentUser} = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();

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
        setImageFileUploading(true);
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
                    //keep the rest of the data of the form unchanged, change only the profile img onClick={handleChange}
                    setFormData({...formData, profilePicture: downloadURL});
                    setImageFileUploading(false);
                })
            }

        )
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    }

    console.log(formData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        // prevent submitting if the form is empty
        if (Object.keys(formData).length === 0){
            setUpdateUserError("No changes made");
            return;
        }
        if(imageFileUploading){
            setUpdateUserError("Please wait for the image to upload");
            return;
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
        
                },
                body: JSON.stringify(formData),
            });
            console.log('API response: ', res);
            const data = await res.json();

            if(!res.ok){
                console.log('API response data: ', data);
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User's profile updated successfully");
            }
            console.log('API response: ', res); // Log the entire response


        } catch(error) {
            dispatch(updateFailure(error.message));
        }
    }
    
    console.log(formData);
    return (
        <div className='max-w-lg mx-auto w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
                <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
                <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
                <TextInput type='password' id='password' placeholder='********' onChange={handleChange}/>
                <Button type='submit' gradientDuoTone="purpleToBlue" outline> Update </Button>
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
            {updateUserSuccess && (
                <Alert color='success' className='mt-5'>
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert color='failure' className='mt-5'>
                    {updateUserError}
                </Alert>
            )}

        </div>
    )
}