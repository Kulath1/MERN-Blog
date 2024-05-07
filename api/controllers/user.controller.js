import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({message: 'API is working'});
};

export const updateUser = async (req, res, next) => {
    // Check user ID match
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'));
    }

    // Process the request
    try {
        const updates = {};  // Object to hold updates

        // Check and set password if provided
        if (req.body.password) {
            if (req.body.password.length < 8) {
                return next(errorHandler(400, 'Password must be at least 8 characters'));
            }
            // Encrypt password
            updates.password = bcryptjs.hashSync(req.body.password, 10);
        }

        // Check and set username if provided
        if (req.body.username) {
            if (req.body.username.length < 5 || req.body.username.length > 15) {
                return next(errorHandler(400, "Username must be between 5 and 15 characters"));
            }
            if (req.body.username.includes(' ')) {
                return next(errorHandler(400, "Username cannot contain spaces"));
            }
            if (req.body.username !== req.body.username.toLowerCase()) {
                return next(errorHandler(400, "Username must be lowercase"));
            }
            if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
                return next(errorHandler(400, "Username must contain only letters and numbers"));
            }
            updates.username = req.body.username;
        }

        // Add other fields to updates if they are present in the request body
        if (req.body.email) updates.email = req.body.email;
        if (req.body.profilePicture) updates.profilePicture = req.body.profilePicture;

        // Update the user information in the database
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: updates,
        }, { new: true });

        // If the update was successful, return the updated user data
        if (updatedUser) {
            const { password, ...rest } = updatedUser._doc;
            res.status(200).json(rest);
        } else {
            return next(errorHandler(404, 'User not found'));
        }
    } catch (error) {
        next(error);
    }
};
