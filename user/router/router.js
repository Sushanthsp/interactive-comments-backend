const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const commentRouter = require("./comments.route");

router.use("/", authRouter);
router.use("/comments", commentRouter);

module.exports = router;

