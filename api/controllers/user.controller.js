import { errorHandler } from "../utils/error.js";
import User from '../models/user.model.js';
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
    res.json({ message: 'The API is running' })
};

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403, "You are not permitted to update this user."));
    };
    if(req.body.password){
        if(req.body.password.length < 8){
            return next(errorHandler(400, "Password must be at least 6 characters."));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if(req.body.username){
        if(req.body.username.length < 5 || req.body.username.length > 15){
            return next(errorHandler(400, 'Username must be between 7 and 20 characters.'));
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, 'Username cannot contain spaces.'));
        }
        if(req.body.username != req.body.username.toLowerCase()){
            return next(errorHandler(400, 'Username must be lowercase'));
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, 'Username can only contain letters and numbers'));
        }
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture,
            }
        }, { new: true });
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    }catch(error){
        next(error);
    }
}

//a function to delete user account
export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.userId){
        return next(403, "You are not allowed to delete this account");
    }
    try{
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted');

    }catch(error){
        next(error);
    }
}