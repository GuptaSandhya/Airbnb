const express = require("express");
const router = express.Router();
// const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn, validateUser, validaEmail } = require("../middleware.js");
const userController = require("../controllers/users");

const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer=({storage});

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm
    )
    .post(
    saveRedirectUrl, 
    passport.authenticate("local", { 
        failureRedirect: '/login', 
        failureFlash: true 
    }) , 
    userController.login
    );

router.get("/", (req, res) => {
    res.redirect("/listing");
});

router.get("/logout", userController.logout);


module.exports = router;