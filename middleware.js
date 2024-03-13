const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");
// const Listing = require("./models/listing.js");
const {listingSchema, reviewSchema, userSchema} = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        // redirectUrl saved
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req, res, next) => {
    try {
        let { id } = req.params;  
        let listing = await Listing.findById(id);  
        if(!listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "you are not the author of this listing");
            return res.redirect(`/listing/${id}`);
        }
        next();      
    } catch (error) {
        next(new ExpressError(400, "This Listing Page is not valid..."));
    }
};

module.exports.isOwnerAll = async(req, res, next) => {
    try {
        let {id} = req.params;
        console.log(id);
        let listing = await Listing.findOne({owner: id});
        console.log(listing);
        if(!listing) {
            req.flash("error", "You don't have any listing.");
            return res.redirect(`/profile`);
        }
        if(!listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "you are not the owner");
            return res.redirect(`/listing`);
        }
        next();
    }catch (err) {
        next(new ExpressError(400, "This listing page is not valid..."));
    }
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(error);
        console.log(errMsg);
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(error);
        console.log(errMsg);
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateUser = (req, res, next) => {
    let {error} = userSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(error);
        console.log(errMsg);
        req.flash("error", `${errMsg}`);
        if(!req.user) {
            return res.redirect("/signup");
        } else {
            return res.redirect(`/update-form/${req.user._id}`)
        }
    }else {
            next();
        }
    };


module.exports.isReviewAuthor = async(req, res, next) => {
    try {
        let { reviewId } = req.params;  
        let review = await Review.findById(reviewId);  
        if(!review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "you are not the author of this review");
            return res.redirect(`/listing/${id}`);
        }
        next();
    } catch (error) {
        next(new ExpressError(400, "This review page is not valid"));
    }
};

module.exports.isReviewAll = async(req, res, next) => {
    try {
        let {id} = req.params;
        console.log(id);
        let review = await Review.findOne({owner: id});
        if(!review) {
            req.flash("error", "You don't have any reviews.");
            return res.redirect(`/profile`);
        }
        if(!review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "you are not the owner");
            return res.redirect(`/listing`);
        }
        next();
    }catch (err) {
        next(new ExpressError(400, "This review page is not valid..."));
    }
};