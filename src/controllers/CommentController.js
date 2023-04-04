import Comment from "../models/comment.js";

const CommentController = {
    createForm: async function (req, res) {
        res.render("create-comment-form", { postID: req.params.postID });
    },
    editForm: async function (req, res) {
        const comment = await Comment.findById(req.params.commentID);
        res.render("edit-comment-form", {
            commentID: comment.id,
            message: comment.message
        });
    },
    create: async function (req, res) {
        var isAnonymous = false;
        if (req.body.isAnonymous) isAnonymous = true;
        await Comment.create({
            message: req.body.message,
            authorID: req.cookies.userID,
            postID: req.params.postID,
            isAnonymous: isAnonymous,
            dateCreated: Date.now()
        });
        res.redirect("/posts");
    },
    edit: async function (req, res) {
        await Comment.findByIdAndUpdate(req.params.commentID, { message: req.body.message });
        res.redirect('/posts');
    },
    delete: async function (req, res) {
        await Comment.findByIdAndDelete(req.params.commentID);
        res.redirect('/posts');
    }
}

export default CommentController;