import { Router } from "express";
import UserController from "./src/controllers/UserController.js";
import PostController from "./src/controllers/PostController.js";
import LikeController from "./src/controllers/LikeController.js";
import CommentController from "./src/controllers/CommentController.js";

const router = Router();

function isLoggedIn(req, res, next) {
    const userID = req.cookies.userID;
    if (userID) {
        // if the user is logged in, proceed with the intended route
        next();
    } else {
        // otherwise, go to the login page
        res.redirect("/login");
    }
}

// Log in
router.get("/login", UserController.loginForm);
router.post("/login", UserController.login);

// Log out
router.post("/logout", UserController.logout);

// Register
router.get("/register", UserController.registerForm);
router.post("/register", UserController.register);

// Rights
router.post("/promote/:userID", isLoggedIn, UserController.promote);
router.post("/demote/:userID", isLoggedIn, UserController.demote);

// Post
router.get("/post", isLoggedIn, PostController.createForm);
router.get("/post/:postID", isLoggedIn, PostController.editForm);
router.post("/createPost", isLoggedIn, PostController.create);
router.post("/editPost/:postID", isLoggedIn, PostController.edit);
router.post("/deletePost/:postID", isLoggedIn, PostController.delete);

// Posts
router.get("/", isLoggedIn, PostController.view);
router.get("/posts", isLoggedIn, PostController.view);

// Profile
router.get("/profile", isLoggedIn, PostController.viewOwn);
router.get("/profile/:userID", isLoggedIn, PostController.viewByUser);

// Comments
router.get("/createCommentForm/:postID", isLoggedIn, CommentController.createForm);
router.get("/editCommentForm/:commentID", isLoggedIn, CommentController.editForm);
router.post("/createComment/:postID", isLoggedIn, CommentController.create);
router.post("/editComment/:commentID", isLoggedIn, CommentController.edit);
router.post("/deleteComment/:commentID", isLoggedIn, CommentController.delete);

// Likes
router.post("/like/:postID", isLoggedIn, LikeController.like);
router.post("/dislike/:postID", isLoggedIn, LikeController.dislike);

export default router;