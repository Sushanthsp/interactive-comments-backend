const express = require("express");
const router = express.Router();
const commentsController = require("../controller/comments.controller");
const commentsValidation = require("../validator/comments.validator");
const { verifyJWTToken } = require("../../middleware/jwt.middleware");

router.post("/", commentsValidation.postComment,verifyJWTToken, commentsController.postComment);
router.put("/:id", commentsValidation.updateComment, verifyJWTToken, commentsController.updateComment);
router.delete("/:id", verifyJWTToken, commentsController.deleteComment);
router.get("/",verifyJWTToken, commentsController.getComment);
router.put("/score/:id", commentsValidation.updateScore, verifyJWTToken, commentsController.updateScore);


router.put("/reply/:id", commentsValidation.postReply, verifyJWTToken, commentsController.postReply);
router.put("/reply/:id/:replyId",commentsValidation.updateReplyValidation, verifyJWTToken, commentsController.updateReply);
router.delete("/reply/:id", verifyJWTToken, commentsController.deleteReply);

router.put("/reply/score/:id/:replyId",commentsValidation.updateReplyScoreValidation, verifyJWTToken, commentsController.updateReplyScore);


module.exports = router;
