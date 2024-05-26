import mongoose, { model } from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            default: 'https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png',
        },
        isAdmin: {
            type: Boolean,
            default: false, // here the user is made an admin by manually changing 'isAdmin' to 'true' in the database(in this case MongoDB)
        }
    }, {timestamps: true}
)

const User = mongoose.model('User', userSchema);

export default User;

