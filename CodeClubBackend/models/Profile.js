const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson",
  },
  entrynum: {
    type: String,
    required: true,
    max: 50,
  },
  fullname: {
    type: String,
    required: true,
    max: 50,
  },
  social: {
    hackerrank: {
      type: String,
    },
    codechef: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    github: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model("myProfile", ProfileSchema);
