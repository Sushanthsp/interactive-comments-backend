const express = require("express");
const router = express.Router();
const commentsController = require("../controller/comments.controller");
const commentsValidation = require("../validator/comments.validator");
const { verifyJWTToken } = require("../../middleware/jwt.middleware");

router.post("/comments", commentsValidation.postComment,verifyJWTToken, commentsController.postComment);
router.put("/comments", commentsValidation.updateComment, commentsController.updateComment);
router.delete("/comments/:id",commentsValidation.deleteComment, verifyJWTToken, commentsController.deleteComment);
router.get("/comments", commentsValidation.getComment, commentsController.getComment);


router.put("/reploy/:id", commentsValidation.updateComment, commentsController.postReply);
router.put("/reploy/:id/:replyId",commentsValidation.deleteComment, verifyJWTToken, commentsController.deleteComment);
router.get("/comments/:replyId", commentsValidation.getComment, commentsController.getComment);

module.exports = router;
