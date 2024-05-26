import {Alert,Button,Checkbox,FileInput,Label,Select,TextInput,Textarea,} from "flowbite-react";
import "react-quill/dist/quill.snow.css";
import {getDownloadURL,getStorage,ref,uploadBytesResumable,} from "firebase/storage";
import { app } from "../firebase";
import { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
  
export default function UpdateAd() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [publishError, setPublishError] = useState(null);
  
    const navigate = useNavigate();
  
    const { currentUser } = useSelector((state) => state.user);
  
    const currentFullDate = new Date();
    const currentDate = new Date().toISOString().split("T")[0];
    const nextWeek = new Date(
      currentFullDate.getFullYear(),
      currentFullDate.getMonth(),
      currentFullDate.getDate() + 31
    )
      .toISOString()
      .split("T")[0];
    const [formData, setFormData] = useState({
      title: "",
      category: "travelling",
      content: "",
      targetURL: "",
      image: "",
      startDate: currentDate,
      endDate: nextWeek,
      isActive: false,
    });
  
    const { adId } = useParams();
  
    useEffect(() => {
      try {
        const fetchAd = async () => {
          const res = await fetch(`/api/ad/getads?adId=${adId}`);
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
            setPublishError(data.message);
            return;
          }
          if (res.ok) {
            setPublishError(null);
            setFormData({
              title: data.ads[0].title,
              category: data.ads[0].category,
              content: data.ads[0].content,
              targetURL: data.ads[0].targetURL,
              image: data.ads[0].image,
              startDate: data.ads[0].startDate.split("T")[0],
              endDate: data.ads[0].endDate.split("T")[0],
              isActive: data.ads[0].isActive,
            });
          }
        };
  
        fetchAd();
      } catch (error) {
        console.log(error.message);
      }
    }, [adId]);
  
    const handleUpdloadImage = async () => {
      try {
        if (!file) {
          setImageUploadError("Please select an image");
          return;
        }
        setImageUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + "-" + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
              setFormData({ ...formData, image: downloadURL });
            });
          }
        );
      } catch (error) {
        setImageUploadError("Image upload failed");
        setImageUploadProgress(null);
        console.log(error);
      }
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`/api/ad/update/${adId}/${currentUser._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
  
        if (res.ok) {
          setPublishError(null);
          navigate(`/dashboard?tab=ads`);
        }
      } catch (error) {
        setPublishError("Something went wrong");
      }
    };
  
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">
          Update an Advertisement
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              className="flex-1"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select a category</option>
              <option value="Travelling">Travelling</option>
              <option value="Educational">Educational</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Finance">Finance</option>
            </Select>
          </div>
          <TextInput
            type="text"
            placeholder="Target URL"
            required
            id="targetURL"
            className="flex-1"
            value={formData.targetURL}
            onChange={(e) =>
              setFormData({ ...formData, targetURL: e.target.value })
            }
          />
          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
              onClick={handleUpdloadImage}
              disabled={imageUploadProgress}
            >
              {imageUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>
          {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
          {formData.image && (
            <img
              src={formData.image}
              alt="upload"
              className="w-full h-72 object-cover"
            />
          )}
  
          <Textarea
            placeholder="Description"
            id="content"
            className="flex-1"
            maxLength="100"
            rows="2"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />
  
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-5">
            <div className="flex flex-col w-full">
              <Label className="px-3 pb-1">Start Date</Label>
              <TextInput
                id="startDate"
                type="date"
                min={currentDate}
                onChange={(e) => {
                  const startDateFull = new Date(e.target.value);
                  const newEndDate = new Date(
                    startDateFull.getFullYear(),
                    startDateFull.getMonth(),
                    startDateFull.getDate() + 31
                  )
                    .toISOString()
                    .split("T")[0];
                  setFormData({
                    ...formData,
                    startDate: e.target.value,
                    endDate: newEndDate,
                  });
                }}
                value={formData.startDate}
              />
            </div>
            <div className="flex flex-col w-full">
              <Label className="px-3 pb-1">End Date</Label>
              <TextInput
                id="endDate"
                type="date"
                min={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                value={formData.endDate}
              />
            </div>
            <div className="flex felx-col justify-center">
              <Label>
                Active
                <Checkbox
                  className="ml-3"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
              </Label>
            </div>
          </div>
  
          <Button type="submit" gradientDuoTone="greenToBlue" className="mb-10">
            Publish
          </Button>
          {publishError && (
            <Alert className="mt-5" color="failure">
              {publishError}
            </Alert>
          )}
        </form>
      </div>
    );
  }