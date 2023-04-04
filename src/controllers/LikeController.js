import Like from "../models/like.js";

const LikeController = {
    like: async function (req, res) {
        await Like.create({
            postID: req.params.postID,
            authorID: req.cookies.userID,
        });
        res.redirect("back");
    },
    dislike: async function (req, res) {
        await Like.findOneAndDelete({
            postID: req.params.postID,
            authorID: req.cookies.userID,
        });
        res.redirect("back");
    }
}

export default LikeController;