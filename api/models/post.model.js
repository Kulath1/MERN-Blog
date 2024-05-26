import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            default: "https://t3.ftcdn.net/jpg/06/63/23/42/360_F_663234285_BXs8ltusy8ITVLSE1TGF7OpcQiOMrAXp.jpg"
        },
        category: {
            type: String,
            default: 'uncategorized',
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        }
    }, {timestamps: true}
)

const Post = mongoose.model('Post', postSchema);

export default Post;