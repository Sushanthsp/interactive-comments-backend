const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const replySchema = new Schema({
    content: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usersSchema'
    }
}, {
    timestamps: true
});

replySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("replySchema", replySchema);
