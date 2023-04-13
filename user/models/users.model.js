const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const UsersSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: function (value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
          },
          message: 'Invalid email address',
        },
      },
      otp: {
        type: Number,
        min: 100000,
        max: 999999,
      },
      password: {
        type: String,
        select: false,
        required: true,
      },
    },
    {
      timestamps: true,
    },
  );
  
UsersSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("usersSchema", UsersSchema);
