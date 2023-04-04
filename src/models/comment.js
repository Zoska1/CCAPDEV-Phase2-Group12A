import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    authorID: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    postID: {
        type: Schema.Types.ObjectId,
        ref: "post",
        required: true
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        required: true
    }
});

const Comment = model("comment", commentSchema);

export default Comment;