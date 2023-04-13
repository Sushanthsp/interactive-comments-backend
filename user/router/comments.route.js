const express = require("express");
const router = express.Router();
const commentsController = require("../controller/comments.controller");
const commentsValidation = require("../validator/comments.validator");
const { verifyJWTToken } = require("../../middleware/jwt.middleware");

router.post("/comments", commentsValidation.postComment,verifyJWTToken, commentsController.postComment);
router.put("/comments", commentsValidation.updateComment, verifyJWTToken, commentsController.updateComment);
router.delete("/comments/:id",commentsValidation.deleteComment, verifyJWTToken, commentsController.deleteComment);
router.get("/comments", commentsValidation.getComment, commentsController.getComment);


router.put("/reploy/:id", commentsValidation.postReplyValidation, verifyJWTToken, commentsController.postReply);
router.put("/reploy/:id/:replyId",commentsValidation.updateReplyValidation, verifyJWTToken, commentsController.updateComment);
router.delete("/reploy/:id/:replyId", verifyJWTToken, commentsController.deleteReply);

module.exports = router;
