const mongoose = require("mongoose");
/**
 * user schema
 * @private
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 128,
      trim: true,
      default: ""
    }
    
  },
  {
    timestamps: true
  }
);

/**
 * @typedef user
 */
module.exports = mongoose.model("user", userSchema);
