import User from "../models/user.js";

const UserController = {
    registerForm: async function (req, res) {
        res.render("register-form");
    },
    register: async function (req, res) {
        const username = req.body.username;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        const existingUser = await User.findOne({ username: username });

        if (existingUser) {
            res.render("register-form", {
                username: username,
                error: "Username already exists"
            });
        } else if (password != confirmPassword) {
            res.render("register-form", {
                username: username,
                error: "Password doesn\'t match"
            });
        } else {
            await User.create({
                username: username,
                password: password
            });
            res.redirect("login");
        }
    },
    loginForm: async function (req, res) {
        res.render("login-form");
    },
    login: async function (req, res) {
        const username = req.body.username;
        const existingUser = await User.findOne({
            username: username,
            password: req.body.password,
        });
        if (existingUser) {
            res.cookie("userID", existingUser.id);
            res.redirect("posts");
        } else {
            res.render("login-form", {
                username: username,
                error: "Invalid credentials"
            });
        }
    },
    logout: async function (req, res) {
        res.clearCookie("userID");
        res.redirect("login");
    },
    promote: async function (req, res) {
        await User.findByIdAndUpdate(req.params.userID, { isAdmin: true });
        res.redirect("back");
    },
    demote: async function (req, res) {
        await User.findByIdAndUpdate(req.params.userID, { isAdmin: false });
        res.redirect("back");
    },
}

export default UserController;