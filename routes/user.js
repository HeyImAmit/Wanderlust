const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware");
const userController = require("../controllers/user");

//signup route
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

//login route
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectURL, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.login);

//logout Route
router.get("/logout", userController.logout);

module.exports = router;