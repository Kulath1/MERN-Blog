import mongoose from 'mongoose';

const adSchema = new mongoose.Schema(
   {
    title: {
         type: String,
         required: true,
         unique: true,
    },
    content: {
         type: String,
         default: 'This advertisement has no content',
    },
    image: {
         type: String,
         default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVryDIlmAOkbzWfrhhYaYtM9CoWXBIC9BZwaIAdQgY9g&s',
    },
    category: {
         type: String,
         default: 'general'
    },
    targetURL: {
         type: String,
         required: true,
    },
    viewCount: {
         type: Number,
         default: 0,
    },
    startDate: {
         type: Date,
         required: true,
    },
    endDate: {
         type: Date,
         required: true,
    },
    isActive: {
         type: Boolean,
         default: true,
    },
   },
   { timestamps: true }
);

const Ad = mongoose.model('Ad', adSchema);

export default Ad;