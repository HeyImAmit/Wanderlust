const User = require("../models/user");

module.exports.renderSignupForm = (req, res)=> {
    res.render("users/signup");
};

module.exports.signup = async(req, res, next)=> {
    try{
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err=> {
            if(err) return next(err);
            req.flash("success", `Welcome to Wanderlust, ${registeredUser.username}!`);
            res.redirect("/listings");
        });
    }catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res)=> {
    res.render("users/login");
};

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectURL || "/listings");
};

module.exports.logout = (req, res, next)=> {
    req.logout(err=> {
        if(err){
            return next(err);
        }
        req.flash("success", "Successfully logged out!");
        res.redirect("/listings");
    });
};