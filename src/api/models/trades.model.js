const mongoose = require("mongoose");
/**
 * trades schema
 * @private
 */
const tradesSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      maxlength: 128,
      trim: true,
      default: ""
    },
    ticker: {
      type: String,
      maxlength: 128,
      trim: true,
      default: ""
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      maxlength: 128,
      trim: true,
      default: ""
    },
    
    price: {
      type: Number,
      maxlength: 20,
      default: 0
    },
    shares: {
      type: Number,
      maxlength: 20,
      default: 0
    }
    
  },
  {
    timestamps: true
  }
);

/**
 * @typedef trades
 */
module.exports = mongoose.model("trade", tradesSchema);
