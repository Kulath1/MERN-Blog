import Ad from '../models/ad.model.js';
import { errorHandler } from '../utils/error.js';

export const createAd = async (req, res, next) => {

   if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to create an ad.'));
   }
   if (!req.body.title || !req.body.targetURL || !req.body.startDate || !req.body.endDate) {
      return next(errorHandler(400, 'Please provide all required fields'));
   }

   const newAd = new Ad(req.body);

   try {
      const saveAd = await newAd.save();
      res.status(201).json(saveAd);
   } catch (error) {
      next(error);
   }
};

export const getAds = async (req, res, next) => {
   try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'desc' ? -1 : 1;
      const allAds = await Ad.find({
         ...(req.query.adId && { _id: req.query.adId }),
      })
         .sort({ startDate: sortDirection })
         .skip(startIndex)
         .limit(limit);

      const now = new Date();

      const filterAds = (ad) => {
         const endDate = new Date(ad.endDate);
         return endDate > now;
      }

      const ads = allAds.filter(filterAds)

      const totalAds = await Ad.countDocuments();

      const lastMonth = new Date(
         now.getFullYear(),
         now.getMonth() - 1,
         now.getDate()
      );
      const lastMonthAds = await Ad.countDocuments({
         createdAt: { $gte: lastMonth }
      });

      const totalViewCount = ads.reduce((sum, ad) => sum + ad.viewCount, 0);

      res.status(200).json({
         ads,
         totalAds,
         lastMonthAds,
         totalViewCount,
      })
   } catch (error) {
      next(error);
   }

};

export const deleteAd = async (req, res, next) => {
   
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
     return next(errorHandler(403, 'You are not allowed to delete this ad'));
   }
   try {
     await Ad.findByIdAndDelete(req.params.adId);
     res.status(200).json('The ad has been deleted');
   } catch (error) {
     next(error);
   }
 };

 export const updateAd = async (req, res, next) => {
   
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
     return next(errorHandler(403, 'You are not allowed to update this ad'));
   }
   try {
     const updatedAd = await Ad.findByIdAndUpdate(
       req.params.adId,
       {
         $set: {
           title: req.body.title,
           content: req.body.content,
           category: req.body.category,
           image: req.body.image,
           targetURL: req.body.targetURL,
           startDate: req.body.startDate,
           endDate: req.body.endDate,
           isActive: req.body.isActive,
         },
       },
       { new: true }
     );
     res.status(200).json(updatedAd);
   } catch (error) {
     next(error);
   }
 };

 export const displayAd = async (req, res, next) => {
   try {
     const currentDate = new Date();
     const limit = parseInt(req.query.limit) || 1;
 
     const ads = await Ad.find({
       ...(req.query.adId && { _id: req.query.adId }),
       endDate: { $gte: currentDate },
       startDate: { $lte: currentDate },
       isActive: true
     })
     .sort({ viewCount: 1 })
     .limit(limit);
 
     const incrementeAds = await Promise.all(
       ads.map(async (ad) => {
         ad.viewCount += 1;
         await ad.save();
         return ad;
       })
     );
 
     res.status(200).json(incrementeAds);
   } catch (error) {
     next(error);
   }
 };