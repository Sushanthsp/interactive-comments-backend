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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'replySchema'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usersSchema'
    },
}, {
    timestamps: true
});

commentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("commentSchema", commentSchema);
