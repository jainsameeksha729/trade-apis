const UserPortfolio = require("../models/userPortfolio.model");
const { MSG } = require("../utils/messages");
const handleResponse = require("../utils/handleResponse");
const APIError = require("../utils/APIError");
const axios = require("axios");

exports.fetchPortfolio = async (req, res, next) => {
  try {
    let { userId } = req.query;

      let data = await UserPortfolio.find({ userId: userId });
      if(data.length){
        handleResponse.success(res, data, 200);

      }else{
        handleResponse.success(res, {message: MSG.PORTFOLIO_NOT_FOUND, status: MSG.FAILED}, 403);

      }
    
  } catch (error) {
    handleResponse.error(
      res,
      new APIError({
        message: MSG.NOT_FOUND,
        errors: error,
        status: 400,
      })
    );
  }
};

exports.fetchReturn = async (req, res, next) => {
  try {
    let { userId } = req.query;
      let currentPrice = 100;
      let data = await UserPortfolio.find({ userId: userId });
      if(data.length){
        let result = 0;
        for(let d of data){
          result += ((currentPrice-d.avgValue)*d.shares)
        }

        handleResponse.success(res, {return: result, status: MSG.SUCCESS}, 200);

      }else{
        handleResponse.success(res, {message: MSG.PORTFOLIO_NOT_FOUND, status: MSG.FAILED}, 403);

      }
    
  } catch (error) {
    handleResponse.error(
      res,
      new APIError({
        message: MSG.NOT_FOUND,
        errors: error,
        status: 400,
      })
    );
  }
};

exports.updatePortfolio = async(userId, ticker, dataToUpdate) => {
  try {
    await UserPortfolio.updateOne(
      { userId: userId, ticker: ticker },
      dataToUpdate
    );
  } catch (error) {
    throw error;
  }
}

