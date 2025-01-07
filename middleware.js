const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "You must be logged in to do so!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectURL = (req, res, next) => {
    if(req.session.redirectURL){
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
};


module.exports.isOwner = async (req, res, next)=> {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next)=> {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error.details.map(el => el.message).join(", "));
    }
    next();
};


module.exports.validateReview = (req, res, next)=> {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error.details.map(el => el.message).join(", "));
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next)=> {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}