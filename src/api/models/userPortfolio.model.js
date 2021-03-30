const mongoose = require("mongoose");
/**
 * userPortfolioSchema
 * @private
 */
const userPortfolioSchema = new mongoose.Schema(
  {
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
    
    avgValue: {
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
 * @typedef userPortfolio
 */
module.exports = mongoose.model("userPortfolio", userPortfolioSchema);
