const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    replies: [{
        content: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        },
        replyingTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

commentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("commentSchema", commentSchema);
