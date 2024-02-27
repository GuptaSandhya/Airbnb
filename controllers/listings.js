const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", {allListing});
}

module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
};

module.exports.showListing = (async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews", 
        populate: {
            path: "author"
        },    
    })
    .populate("owner")
    ;
    if(!listing){
        req.flash("error", "listing you requested for does not existed");
        res.redirect("/listing");
    }
    console.log(listing);
    res.render("listing/show.ejs", {listing});
});

module.exports.createListing = (async(req, res, next) => {
    //let {title, description, image, price, country, location} = req.body;
    //let listing = req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);   
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    // // console.log(req.user);
    await newListing.save();
    req.flash("success", "new listing created!");
    res.redirect("/listing");
});

module.exports.renderEditForm = (async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "listing you requested for does not existed");
        res.redirect("/listing");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listing/edit.ejs", { listing, originalImageUrl });
});

module.exports.updateListing = (async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success", "listing updated");
    res.redirect(`/listing/${id}`);
});

module.exports.destroyListing = (async(req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted!");
    res.redirect("/listing");
});