import { errorHandler } from "../utils/error.js";
import User from '../models/user.model.js';
import bcryptjs from "bcryptjs";
import Post from "../models/post.model.js";
import { title } from "process";

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

export const signout = (req, res, next) => {
    try{
        res.clearCookie('access_token').status(200).json("User has been signed out");
    }catch(error){
        next(error)
    }
}

export const getposts = async (req, res, next) => {
    try{
        const startIndex = parseInt(req.query.startIndex) || 0; // to know which post to start fetching
        const limit = parseInt(req.query.limit) || 9; //limit the number of posts shown in the dashboard
        const sortDirection = req.query.order === 'asc' ? 1 : -1; //sort the posts in the newest to oldest order

        const posts = await Post.find({
            ...(req.query.userId && {userId: req.query.userId}), //specify the userId to which the post should be sent
            ...(req.query.category && {category: req.query.category}), //if the search query includes a category, search for it
            ...(req.query.slug && {slug: req.query.slug}), 
            ...(req.query.postId && {_id: req.query.postId}), 
            //search for a post by considering the title as well as the content of the post
            ...(req.query.searchTerm && {
                //or allows to in between two places(that is title and content)
                $or:[
                    {title: {$regex: req.query.searchTerm, $options: 'i'}},
                    {content: {$regex: req.query.searchTerm, $options: 'i'}},
                ],
            }), 
        }).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit);

        //getting the total number of posts
        const totalPosts = await Post.countDocuments();

        //getting the total number of posts in the last month
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        );
        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }, // 'gte' means greater than
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });

    }catch(error){
        next(error);
    }
}