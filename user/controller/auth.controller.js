const UsersSchema = require("../models/users.model");
const { setPassword, verifyPassword } = require('../../helper/password.helper');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

module.exports.register = async (request, response, next) => {
    try {
        const { name, email, password } = request.body;

        const checkUser = await UsersSchema.findOne({
            email: email,
        })
        if (checkUser) {
            return response.status(409).json({
                status: false,
                message: "email is already registered",
                data: null,
            });
        }

        //GENERATING PASSWORD
        const pass = await setPassword(password); 
        //GENERATING OTP
        const otp = '123456';

        //CREATING USER IN MONGODB
        newUsers = await UsersSchema.create({
            name,
            email,
            password: pass,
            otp: otp,
        });

        const token = jwt.sign(JSON.stringify(newUsers), config.JWT_AUTH_TOKEN);
        return response.json({
            status: true,
            message: "User registered successfully",
            data: {
                _id: newUsers._id,
                name: newUsers.name,
                email: newUsers.email,
                token:token
            },
        });

    } catch (e) {
        console.log(e);
        return response.status(500).json({
            status: false,
            message: "Something went wrong",
            data: null,
        });
    }
};

module.exports.login = async (request, response, next) => {
    try {
        const { email, password } = request.body;

        const userData = await UsersSchema.findOne({
            email: email,
        }).select("+password");

        if (!userData) {
            return response.status(401).json({
                status: false,
                message: "email not found",
                data: null,
            });
        }

        const checkPassword = await verifyPassword(password, userData.password);
        if (!checkPassword) {
            return response.status(401).json({
                status: false,
                message: "Password does not match",
                data: null,
            });
        }

        const token = jwt.sign(JSON.stringify(userData), config.JWT_AUTH_TOKEN);
        const sendData = { userData, token: token };

        return response.json({
            status: true,
            message: "Login successful",
            data: sendData,
        });
    } catch (e) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong",
            data: null,
        });
    }
};

module.exports.verifyOtp = async (request, response, next) => {
    try {
        const { user, otp } = request.body;

        const userData = await UsersSchema.findById(user?._id);

        if (!userData) {
            return response.status(404).json({
                status: false,
                message: "User not found",
                data: null,
            });
        }

        if (userData.otp !== otp) {
            return response.status(401).json({
                status: false,
                message: "OTP does not match",
                data: null,
            });
        }

        return response.json({
            status: true,
            message: "OTP verified successfully",
            data: null,
        });
    } catch (e) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong",
            data: null,
        });
    }
};
