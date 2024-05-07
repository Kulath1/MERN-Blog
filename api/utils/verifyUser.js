import jwt from 'jsonwebtoken';
import {errorHandler} from './error.js';

// a function to verify whether the user is authenticated. (that is if the user is signed in)
export const verifyToken = (req, res, next) => {
    // create a token using the access cookie
    const token = req.cookies.access_token;

    if(!token){
        return next(errorHandler(401, 'Unauthorized'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(401, 'Unauthorized'));
        }
        //if the user is verified, he's added to the request
        req.user = user;
        next();
    });
};