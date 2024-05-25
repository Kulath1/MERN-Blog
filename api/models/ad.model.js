import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            default: "https://marketingepic.com/wp-content/uploads/2017/02/Graphic_Of_Billboard_With_Word_Ad.webp"
        },
        category: {
            type: String,
            default: 'uncategorized',
        },
        viewCount: {
            type: Number,
            default: 0,
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        isDisplayed: {
            type: Boolean,
            required: true
        },
        directedURL: {
            type: String,
            required: true
        },
    }, {timestamps: true}
)

const Ad = mongoose.model('Ad', adSchema);

export default Ad;