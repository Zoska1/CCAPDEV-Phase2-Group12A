import Post from "../models/post.js";
import User from "../models/user.js";
import Comment from "../models/comment.js";
import Like from "../models/like.js";

async function getFormattedPosts(loggedInUser, postsFromDB) {
    const formattedPosts = [];
    for (const post of postsFromDB) {
        const postAuthor = await User.findById(post.authorID);
        const likes = await Like.count({ postID: post.id });
        const liked = await Like.findOne({ postID: post.id, authorID: loggedInUser.id });

        let postUsername = "Anonymous";
        if (!post.isAnonymous) postUsername = postAuthor.username;

        const commentsFromDB = await Comment.find({ postID: post.id }).sort({ dateCreated: 1 });
        const formattedComments = [];

        for (let comment of commentsFromDB) {
            const commentAuthor = await User.findById(comment.authorID);
            let commentUsername = 'Anonymous';
            if (!comment.isAnonymous) commentUsername = commentAuthor.username;

            let canEditComment = false;
            if (loggedInUser.isAdmin) canEditComment = true;
            else if (comment.authorID == loggedInUser.id) canEditComment = true;

            formattedComments.push({
                commentID: comment.id,
                message: comment.message,
                commentAuthorName: commentUsername,
                date: comment.dateCreated.toLocaleString(),
                canEditComment: canEditComment
            });
        }

        let canEditPost = false;
        if (loggedInUser.isAdmin) canEditPost = true;
        else if (post.authorID == loggedInUser.id) canEditPost = true;

        formattedPosts.push({
            postID: post.id,
            message: post.message,
            postAuthorID: postAuthor.id,
            postAuthorName: postUsername,
            tag: post.tag,
            date: post.dateCreated.toLocaleString(),
            comments: formattedComments,
            likes: likes,
            liked: liked,
            canEditPost: canEditPost
        });
    }
    return formattedPosts;
}

const PostController = {
    view: async function (req, res) {
        const postsFromDB = await Post.find().sort({ dateCreated: -1 });
        const loggedInUser = await User.findById(req.cookies.userID);
        const formattedPosts = await getFormattedPosts(loggedInUser, postsFromDB);
        res.render("feed", { posts: formattedPosts });
    },
    viewOwn: async function (req, res) {
        const postsFromDB = await Post.find({ authorID: req.cookies.userID }).sort({ dateCreated: -1 });
        const loggedInUser = await User.findById(req.cookies.userID);
        const formattedPosts = await getFormattedPosts(loggedInUser, postsFromDB);
        const user = await User.findById(req.cookies.userID);
        res.render("profile", {
            canManageAdmins: user.isAdmin,
            userID: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            posts: formattedPosts
        });
    },
    viewByUser: async function (req, res) {
        let postsFromDB;
        const loggedInUser = await User.findById(req.cookies.userID);
        if (req.params.userID == loggedInUser.id || loggedInUser.isAdmin) {
            // if viewing the currently logged in user, show all posts even anonymous posts
            postsFromDB = await Post.find({ authorID: req.params.userID }).sort({ dateCreated: -1 });
        } else {
            // otherwise, don't show anonymous posts
            postsFromDB = await Post.find({ authorID: req.params.userID, isAnonymous: false }).sort({ dateCreated: -1 });
        }
        const formattedPosts = await getFormattedPosts(loggedInUser, postsFromDB);
        const user = await User.findById(req.params.userID);
        res.render("profile", {
            canManageAdmins: loggedInUser.isAdmin,
            userID: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            posts: formattedPosts
        });
    },
    createForm: async function (req, res) {
        res.render("create-post-form");
    },
    editForm: async function (req, res) {
        const post = await Post.findById(req.params.postID);
        res.render("edit-post-form", {
            postID: post.id,
            message: post.message
        });
    },
    create: async function (req, res) {
        var isAnonymous = false;
        if (req.body.isAnonymous) isAnonymous = true;
        let tagNumber = Math.floor(Math.random() * 99999);
        await Post.create({
            message: req.body.message,
            isAnonymous: isAnonymous,
            tag: '#FW' + tagNumber,
            authorID: req.cookies.userID,
            dateCreated: Date.now()
        });
        res.redirect('/posts');
    },
    edit: async function (req, res) {
        await Post.findByIdAndUpdate(req.params.postID, { message: req.body.message });
        res.redirect('/posts');
    },
    delete: async function (req, res) {
        await Post.findByIdAndDelete(req.params.postID);
        res.redirect('/posts');
    }
}

export default PostController;