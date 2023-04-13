const jwt = require("jsonwebtoken");
const commentSchema = require("../models/comment.model");

module.exports.postComment = async (req, res, next) => {
    try {
        // Extract data from request body
        const { content, score, replies, user } = req.body;

        // Validate request body
        if (!content || !score || !replies || !user) {
            return res
                .status(422)
                .json({ status: false, message: "All fields are required", data: null });
        }

        // Create new comment
        const comment = new commentSchema({
            content,
            score,
            replies,
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

        // Extract updated data from request body
        const { content, score, replies } = req.body;

        // Find comment by ID and update
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { content, score, replies },
            { new: true }
        );

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
        // Extract comment ID from request parameters
        const id = req.params.id;

        // Delete comment by ID
        await Comment.findByIdAndDelete(id);

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
        // Retrieve all comments from database
        const comments = await Comment.find();

        // Return response
        return res.status(200).json({ status: true, message: "Comments retrieved", data: comments });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Failed to retrieve comments", data: null });
    }
};

module.exports.postReply = async (req, res, next) => {
    try {
        // Extract data from request body
        const { content, user } = req.body;
        const { id } = req.params;

        // Validate request body
        if (!content || !user || !id) {
            return res
                .status(422)
                .json({ status: false, message: "All fields are required", data: null });
        }

        // Find the parent comment
        const parentComment = await Comment.findById(id);
        if (!parentComment) {
            return res
                .status(404)
                .json({ status: false, message: "Parent comment not found", data: null });
        }

        // Create new comment as reply
        const reply = new Comment({
            content,
            user
        });

        // Save the reply comment and update parent comment's replies array
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

module.exports.updateReply = async (req, res, next) => {
    try {
        // Extract data from request body
        const { content, user } = req.body;
        const { id, replyId } = req.params;

        // Validate request body
        if (!content || !user || !id || !replyId) {
            return res
                .status(422)
                .json({ status: false, message: "All fields are required", data: null });
        }

        // Find the parent comment
        const parentComment = await Comment.findById(id);
        if (!parentComment) {
            return res
                .status(404)
                .json({ status: false, message: "Parent comment not found", data: null });
        }

        // Find the reply to update
        const reply = await Comment.findById(replyId);
        if (!reply) {
            return res
                .status(404)
                .json({ status: false, message: "Reply not found", data: null });
        }

        // Update reply's content and user
        reply.content = content;
        reply.user = user;
        await reply.save();

        return res
            .status(200)
            .json({ status: true, message: "Reply updated successfully", data: null });
    } catch (err) {
        next(err);
    }
};

// Function to recursively delete all child replies of a comment
const deleteChildReplies = async (id) => {
    const comment = await Comment.findById(id);
    if (comment && comment.replies.length > 0) {
        for (const replyId of comment.replies) {
            await deleteChildReplies(replyId);
        }
    }
    await Comment.findByIdAndDelete(id);
};

module.exports.deleteReply = async (req, res, next) => {
    try {
        // Extract data from request parameters
        const { id, replyId } = req.params;

        // Validate request parameters
        if (!id || !replyId) {
            return res
                .status(422)
                .json({ status: false, message: "All fields are required", data: null });
        }

        // Find the parent comment
        const parentComment = await Comment.findById(id);
        if (!parentComment) {
            return res
                .status(404)
                .json({ status: false, message: "Parent comment not found", data: null });
        }

        // Find the reply to delete
        const reply = await Comment.findById(replyId);
        if (!reply) {
            return res
                .status(404)
                .json({ status: false, message: "Reply not found", data: null });
        }

        // Delete the reply and remove it from parent comment's replies array
        await deleteChildReplies(replyId);
        parentComment.replies = parentComment.replies.filter((r) => r.toString() !== replyId);
        await parentComment.save();

        return res
            .status(200)
            .json({ status: true, message: "Reply deleted successfully", data: null });
    } catch (err) {
        next(err);
    }
};
