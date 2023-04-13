const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const Users = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      number: {
        type: Number,
        required: true,
        unique: true
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
  
Users.plugin(mongoosePaginate);

module.exports = mongoose.model("Users", Users);
