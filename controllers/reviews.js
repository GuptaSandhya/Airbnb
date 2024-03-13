const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = (async(req, res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    newReview.listing = listing._id;
    // console.log(newReview);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    req.flash("success", "New review created");
    res.redirect(`/listing ${listing._id}`);

    // console.log("new review saved");
    // res.send("new review saved");
});

module.exports.destroyReview = (async(req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted");
    res.redirect(`/listing/${id}`);
});