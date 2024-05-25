import Ad from "../models/ad.model.js";
import { errorHandler } from "../utils/error.js";



export const createAd = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, "You are not allowed to create an advertiesment"));
    }
    if(!req.body.title || !req.body.category || !req.body.startDate || !req.body.endDate){
        return next(errorHandler(400, 'Please provide all required fields'));
    }

    const newAd =new Ad(req.body);  
    try{
        const savedAd = await newAd.save();
        res.status(201).json(savedAd);
    }catch(error){
        next(error);
    }
}

export const updateAd = async (req, res, next) => {
    
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(403, "You are not allowed to update this ad")
    }

    try{
        const updatedAd = await Ad.findByIdAndUpdate(
            req.params.adId,
            { $set: {
                title: req.body.title,
                category: req.body.category,
                image: req.body.image,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                isDisplayed: req.body.isDisplayed,
            }},
            {new: true}
        )
        res.status(200).json(updatedAd);

    }catch(error){
        next(error);
    }

}


