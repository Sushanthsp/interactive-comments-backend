const Joi = require('joi');

// Validation middleware for postComment
module.exports.postComment = async (request, response, next) => {
    const commentSchema = Joi.object().keys({
        content: Joi.string().required(),
        score: Joi.number().required(),
        replies: Joi.array().items(
            Joi.object().keys({
                content: Joi.string().required(),
                score: Joi.number().required(),
                replyingTo: Joi.string().optional()
            })
        ).optional()
    });

    const { error } = commentSchema.validate(request.body);

    if (error) {
        return response.status(422).json({ status: false, message: error.details[0].message, data: null });
    } else {
        return next();
    }
};


module.exports.updateComment = async (request, response, next) => {
    const commentSchema = Joi.object().keys({
        content: Joi.string().required(),
        score: Joi.number().required(),
        replies: Joi.array().items(
            Joi.object().keys({
                content: Joi.string().required(),
                score: Joi.number().required(),
                replyingTo: Joi.string().optional()
            })
        ).optional()
    });

    const { error } = commentSchema.validate(request.body);

    if (error) {
        return response.status(422).json({ status: false, message: error.details[0].message, data: null });
    } else {
        return next();
    }
};

module.exports.deleteComment = async (request, response, next) => {
    const { id } = request.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return response.status(422).json({ status: false, message: "Invalid comment ID", data: null });
    } else {
        return next();
    }
};

module.exports.getComment = async (request, response, next) => {
    const { id } = request.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return response.status(422).json({ status: false, message: "Invalid comment ID", data: null });
    } else {
        return next();
    }
};

// Joi validation schema for reply object
const replySchema = Joi.object().keys({
  content: Joi.string().required(),
  replies: Joi.array().default([])
});

// Joi validation for postReply
module.exports.postReplyValidation = (req, res, next) => {
  const schema = Joi.object().keys({
    commentId: Joi.string().required(),
    reply: replySchema.required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(422)
      .json({ status: false, message: error.details[0].message, data: null });
  }

  next();
};

// Joi validation for updateReply
module.exports.updateReplyValidation = (req, res, next) => {
  const schema = Joi.object().keys({
    commentId: Joi.string().required(),
    replyId: Joi.string().required(),
    reply: replySchema.required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(422)
      .json({ status: false, message: error.details[0].message, data: null });
  }

  next();
};
