import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";

export const create = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, "You are not allowed to create a post"));
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'Please provide all required fields'));
    }

    //create a user friendly URL for a post
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');

    const newPost =new Post({ 
        ...req.body, 
        slug, 
        userId: req.user.id,
    });  
    try{
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    }catch(error){
        next(error);
    }
}

export const deletepost = async (req, res, next) => {
    // check if the user is an admin and the owner of the post
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to delete this post'));
    }

    try{
        await Post.findByIdAndDelete(req.params.postId)
        res.status(200).json("The post has been deleted");
    }catch(error){
        next(error);
    }

}