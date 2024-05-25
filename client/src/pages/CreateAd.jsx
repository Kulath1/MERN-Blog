import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {app} from '../firebase'
import { useNavigate } from "react-router-dom";
import { useAds } from '../AdProvider.jsx';

export default function CreateAd(){
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const { addAd } = useAds(); // Use the custom hook to access ad context
    const navigate = useNavigate();
    const handleUploadImage =async () => {
        try{
            if(!file){
                setImageUploadError("Please select an image");
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app); 
            const fileName = new Date().getTime() + '-' + file.name; //create a unique file name  
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError("Image upload failed");
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({...formData, image: downloadURL})
                    })
                }

            )
        }catch(error){
            setImageUploadError("Image upload failed");
            setImageUploadProgress(null);
            console.log(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setFormData({...formData, 
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
            })
            const res = await fetch('/api/ad/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json();
            if(!res.ok){
                setPublishError(data.message);
                return
            }
            if(res.ok){
                setPublishError(null);
                addAd(data);
                navigate(`/dashboard?tab=ads`)
            }
            
        }catch(error){
            setPublishError("Something went wrong")
        }
    }
    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen"> 
            <h1 className="text-center text-3xl my-7 font-semibold"> 
                Create an ad 
            </h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                   <TextInput 
                        typeof="text" 
                        placeholder="Title" 
                        required id="title"
                        className="flex-1"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                   <Select onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        <option value='uncategorized'>Select a category</option>
                        <option value='casual dresses'>Travelling</option>
                        <option value='accessories'>Entertainment</option>
                        <option value='foot wear'>Educational</option>
                   </Select>
                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-400 border-dotted p-3">
                    <FileInput typeof='file' accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
                    <Button 
                    type="button" 
                    gradientDuoTone='purpleToBlue' 
                    size='sm' 
                    outline 
                    disabled={imageUploadProgress}
                    onClick={handleUploadImage}
                    >
                        {imageUploadProgress ? 
                        <div>
                            <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}/>
                        </div>  : ("Upload Image")}
                    </Button>
                </div>
                {imageUploadError && 
                    <Alert color='failure'>
                        {imageUploadError}
                    </Alert>}
                {/* Display the image */}
                {formData.image && (
                    <img
                    src = {formData.image}
                    alt='upload'
                    className="w-full h-72 object-cover"
                    />

                )}

               <ReactQuill 
                    theme="snow" 
                    placeholder="Write something..." 
                    className="h-72 mb-12" 
                    required
                    onChange={(value) => setFormData({...formData, content: value})}/>
                 
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                   <TextInput 
                        typeof="date" 
                        placeholder="start Date" 
                        required id="startDate"
                        className="flex-1"
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                    <TextInput 
                        typeof="date" 
                        placeholder="end Date" 
                        required id="endDate"
                        className="flex-1"
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                   
                </div>
                
                <Button type="submit" gradientDuoTone="greenToBlue">
                    Post
                </Button>

                {publishError && 
                    <Alert className = 'mt-5' color='failure'>
                        {publishError}
                    </Alert>}

            </form>
        </div>
    )
}