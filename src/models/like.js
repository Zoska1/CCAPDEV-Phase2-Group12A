import { Schema, model } from "mongoose";

const likeSchema = new Schema({
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
});

const Like = model("like", likeSchema);

export default Like;