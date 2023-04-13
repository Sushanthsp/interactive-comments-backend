const Joi = require('joi');

// Validation middleware for postComment
module.exports.postComment = async (request, response, next) => {
    const commentSchema = Joi.object().keys({
        content: Joi.string().required()
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

module.exports.updateScore = async (request, response, next) => {
    const commentSchema = Joi.object().keys({
        score: Joi.number().required()
    });

    const { error } = commentSchema.validate(request.body);

    if (error) {
        return response.status(422).json({ status: false, message: error.details[0].message, data: null });
    } else {
        return next();
    }
};

module.exports.postReply = async (request, response, next) => {
    const commentSchema = Joi.object().keys({
        content: Joi.string().required(),
     })
    const { error } = commentSchema.validate(request.body);

    if (error) {
        return response.status(422).json({ status: false, message: error.details[0].message, data: null });
    } else {
        return next();
    }
};

module.exports.updateReplyValidation = (req, res, next) => {
    const schema = Joi.object().keys({
        content: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res
            .status(422)
            .json({ status: false, message: error.details[0].message, data: null });
    }

    next();
};

module.exports.updateReplyScoreValidation = (req, res, next) => {
    const schema = Joi.object().keys({
        score: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res
            .status(422)
            .json({ status: false, message: error.details[0].message, data: null });
    }

    next();
};

