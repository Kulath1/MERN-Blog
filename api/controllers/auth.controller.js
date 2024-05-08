import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// Signup route
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password || username === "" || email === "" || password === "") {
        next(errorHandler(400, "All fields are required"));
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user instance
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.json("Signup successful");
    } catch (error) {
        next(error);
    }
};

// Signin route
export const signin = async (req, res, next) => {
    const { username, password } = req.body;

    // Check if all required fields are provided
    if (!username || !password || username === '' || password === '') {
        next(errorHandler(400, 'All fields are required'));
    }

    try {
        // Find the user by username
        const validUser = await User.findOne({ username });
        if (!validUser) {
            next(errorHandler(404, 'User not found'));
        }

        // Compare the provided password with the stored hashed password
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, "Invalid password"));
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin },
            process.env.JWT_SECRET
        );

        // Exclude the password field from the response
        const { password: pass, ...rest } = validUser._doc;
        res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);
    } catch (error) {
        next(error);
    }
};

// Google signin route
export const google = async (req, res, next) => {

    //recieve information
    const { email, name, googlePhotoUrl } = req.body;
    
    try{
        //check if the user exists
        const user = await User.findOne({name});

        if(user){
            //create a token
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);
            
            const {password, ...rest} = user._doc;
            
            // set a status and a cookie
            res.status(200).cookie('access_token', token, {
                httpOnly: true, //to make more secure
            }).json(rest);
        }else{
            //create a random password
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();

            const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET);
            const {password, ...rest} = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true, 
            }).json(rest);
        }
    }catch(error){
        // use middleware to handle errors
        next(error)
    }
};
