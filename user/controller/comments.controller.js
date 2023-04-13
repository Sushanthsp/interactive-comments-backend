const jwt = require("jsonwebtoken");
const commentSchema = require("../models/comments.model");
const replySchema = require("../models/reply.model");
const mongoose = require("mongoose");

module.exports.postComment = async (req, res, next) => {
    try {
        // Extract data from request body
        const { content, user } = req.body;
         if (!content) {
            return res
                .status(422)
                .json({ status: false, message: "Content is required", data: null });
        }

        // Create new comment
        const comment = new commentSchema({
            content,
            score: 0,
            replies: [],
            user
        });

        // Save comment to database
        const createdComment = await comment.save();

        // Return response
        return res
            .status(201)
            .json({ status: true, message: "Comment created", data: createdComment });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: false, message: "Internal server error", data: null });
    }
};

module.exports.updateComment = async (req, res, next) => {
    try {
        // Extract comment ID from request parameters
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(200)
                .json({ status: true, message: "Invalid comment ID" });
        }
        // Extract updated data from request body
        const { content, replies } = req.body;

        // Find comment by ID and update
        const updatedComment = await commentSchema.findById(id);

        // Check if comment exists
        if (!updatedComment) {
            return res
                .status(404)
                .json({ status: false, message: "Comment not found", data: null });
        }

         // Check if the comment belongs to the user making the request
         if (updatedComment?.user?._id.toString() !== req?.body.user?._id) {
            return res
                .status(403)
                .json({ status: false, message: "unauthorized to comment", data: null });
        }

        // Update the comment
        updatedComment.content = content;
        updatedComment.replies = replies;
        await updatedComment.save();

        // Return response
        return res
            .status(200)
            .json({ status: true, message: "Comment updated", data: updatedComment });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: false, message: "Internal server error", data: null });
    }
};

module.exports.updateScore = async (req, res, next) => {
    try {
        // Extract comment ID from request parameters
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(200)
                .json({ status: true, message: "Invalid comment ID" });
        }
        // Extract updated data from request body
        const { score } = req.body;

        // Find comment by ID and update
        const updatedComment = await commentSchema.findById(id)

         
        // Check if comment exists
        if (!updatedComment) {
            return res
                .status(404)
                .json({ status: false, message: "Comment not found", data: null });
        }

          // Check if the comment belongs to the user making the request
          if (updatedComment?.user?._id.toString() === req?.body.user?._id) {
            return res
                .status(403)
                .json({ status: false, message: "not allowed to upvote", data: null });
        }


        // Update the comment
        updatedComment.score = score;
        await updatedComment.save();

        // Return response
        return res
            .status(200)
            .json({ status: true, message: "Comment updated", data: updatedComment });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: false, message: "Internal server error", data: null });
    }
};


module.exports.deleteComment = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(200)
                .json({ status: true, message: "Invalid comment ID" });
        }


        // Find comment by ID
        const comment = await commentSchema.findById(id);

        // Check if comment exists
        if (!comment) {
            return res
                .status(404)
                .json({ status: false, message: "Comment not found", data: null });
        }

        // Check if the reply belongs to the user making the request
        if (comment?.user?._id.toString() !== req?.body.user?._id) {
            return res
                .status(403)
                .json({ status: false, message: "unauthorized to delete", data: null });
        }
        // Delete comment by ID
        await comment.remove();


        // Return response
        return res
            .status(200)
            .json({ status: true, message: "Comment deleted", data: null });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: false, message: "Internal server error", data: null });
    }
};

module.exports.getComment = async (req, res, next) => {
    try {
        // Find all comments and populate user field, replies array with user, and replies array with replies recursively
        const comments = await commentSchema.find().populate({
            path: "user",
            model: "usersSchema"
        }).populate({
            path: "replies",
            populate: [{
                path: "user",
                model: "usersSchema"
            }]
        });

        return res
            .status(200)
            .json({ status: true, message: "All comments with replies retrieved successfully", data: comments });
    } catch (err) {
        next(err);
    }
};

module.exports.postReply = async (req, res, next) => {
    try {
        // Extract data from request body
        const { content, user } = req.body;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(404)
                .json({ status: false, message: "Invalid comment ID", data: null });
        }

        // Validate request body
        if (!content) {
            return res
                .status(422)
                .json({ status: false, message: "Content is required", data: null });
        }

        // Find the parent comment
        const parentComment = await commentSchema.findById(id);
        if (!parentComment) {
            return res
                .status(404)
                .json({ status: false, message: "Parent comment not found", data: null });
        }

        // Create new reply
        const reply = new replySchema({
            content,
            user,
            score: 0,
        });

        // Save the reply and update parent comment's replies array
        await reply.save();
        parentComment.replies.push(reply);
        await parentComment.save();

        return res
            .status(201)
            .json({ status: true, message: "Reply added successfully", data: null });
    } catch (err) {
        next(err);
    }
};

// Update a reply
module.exports.updateReply = async (req, res, next) => {
    try {
        // Extract data from request body
        const { content } = req.body;
        const { id, replyId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(404)
                .json({ status: false, message: "Invalid reply ID", data: null });
        }

        // Find the reply
        const reply = await replySchema.findById(replyId);
        if (!reply) {
            return res
                .status(404)
                .json({ status: false, message: "Reply not found", data: null });
        }

        // Check if the reply belongs to the user making the request
        if (reply?.user?._id.toString() !== req?.body.user?._id) {
            return res
                .status(403)
                .json({ status: false, message: "unauthorized to update", data: null });
        }

        // Update reply content and score
        reply.content = content;
        await reply.save();

        return res
            .status(200)
            .json({ status: true, message: "Reply updated successfully", data: null });
    } catch (err) {
        next(err);
    }
};

// Update a reply
module.exports.updateReplyScore = async (req, res, next) => {
    try {
        // Extract data from request body
        const { score } = req.body;
        const { id, replyId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(404)
                .json({ status: false, message: "Invalid reply ID", data: null });
        }

        // Find the reply
        const reply = await replySchema.findById(replyId);
        if (!reply) {
            return res
                .status(404)
                .json({ status: false, message: "Reply not found", data: null });
        } 

        // Check if the reply belongs to the user making the request
        if (reply?.user?._id.toString() === req?.body.user?._id) {
            return res
                .status(403)
                .json({ status: false, message: "not allowed to upvote", data: null });
        }

        // Update reply content and score
        reply.score = score;
        await reply.save();

        return res
            .status(200)
            .json({ status: true, message: "Reply updated successfully", data: null });
    } catch (err) {
        next(err);
    }
};

//delete reply
module.exports.deleteReply = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(404)
                .json({ status: false, message: "Invalid reply ID", data: null });
        }

        // Find the reply to delete
        const replyToDelete = await replySchema.findById(id);
        if (!replyToDelete) {
            return res
                .status(404)
                .json({ status: false, message: "Reply not found", data: null });
        }

         // Check if the reply belongs to the user making the request
         if (replyToDelete?.user?._id.toString() !== req?.body.user?._id) {
            return res
                .status(403)
                .json({ status: false, message: "unauthorized to delete", data: null });
        }

        await replySchema.deleteOne({ _id: id });



        return res
            .status(200)
            .json({ status: true, message: "Reply deleted successfully", data: null });
    } catch (err) {
        next(err);
    }
};