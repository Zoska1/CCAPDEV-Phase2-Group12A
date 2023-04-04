import { Schema, model } from "mongoose";

const postSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    authorID: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    tag: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    }
});

const Post = model("post", postSchema);

export default Post;