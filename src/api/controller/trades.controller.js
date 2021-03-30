const Trades = require("../models/trades.model");
const UserPortfolio = require("../models/userPortfolio.model");
const { MSG } = require("../utils/messages");
const handleResponse = require("../utils/handleResponse");
const APIError = require("../utils/APIError");
const { updatePortfolio } = require("./userPortfolio.controller");

/**
 * Method to save the trade if type is SOLD
 * @param {object} data An object
 * @param {boolean} newTrade A flag to check a new trade request or a request to update the existing trade
 * @returns
 */
const soldTypeTrade = async (data, newTrade = true) => {
  try {
    data.shares = parseFloat(data.shares);
    data.price = parseFloat(data.price);
    // get the security from existing portfolio
    let portfolio = await UserPortfolio.find({
      userId: data.userId,
      ticker: data.ticker,
    });

    if (portfolio.length) {
      // Security already exists

      // check for the share count
      if (portfolio[0].shares >= data.shares) {
        portfolio[0].shares = portfolio[0].shares - data.shares;

        // update user portfolio
        await updatePortfolio(data.userId, data.ticker, {
          shares: portfolio[0].shares,
        });

        // add new trade entry in trades collection
        if (newTrade) await new Trades(data).save();
        else {
          await Trades.updateOne({ _id: data.tradeId }, data);
        }

        return {
          data: { message: MSG.SUBMITTED, status: "Success" },
          status: 200,
        };
      } else {
        // insufficient shares, can't fullfil sold request

        return {
          data: { message: MSG.SHARE_UNSUFFICIENT, status: "Failed" },
          status: 403,
        };
      }
    } else {
      // If security not present, can't fullfil sold request
      return {
        data: { message: MSG.SHARE_UNSUFFICIENT, status: "Failed" },
        status: 403,
      };
    }
  } catch (error) {
    console.log("errorr", error);
    throw error;
  }
};

/**
 * Method to save the trade if type is BUY
 * @param {object} data An object
 * @param {boolean} newTrade A flag to check a new trade request or a request to update the existing trade
 * @returns
 */
const buyTypeTrade = async (data, newTrade = true) => {
  try {
    data.shares = parseFloat(data.shares);
    data.price = parseFloat(data.price);

    // get the security from existing portfolio
    let portfolio = await UserPortfolio.find({
      userId: data.userId,
      ticker: data.ticker,
    });
    if (portfolio.length) {
      // Security already exists

      // calculate updated average value and shares count
      portfolio[0].avgValue =
        (portfolio[0].avgValue * portfolio[0].shares +
          data.price * data.shares) /
        (portfolio[0].shares + data.shares);

      portfolio[0].shares = portfolio[0].shares + data.shares;

      // update user portfolio
      await updatePortfolio(data.userId, data.ticker, portfolio[0]);
    } else {
      portfolio = {
        userId: data.userId,
        shares: data.shares,
        avgValue: data.price,
        ticker: data.ticker,
      };

      // add a security in user portfolio
      await new UserPortfolio(portfolio).save();
    }

    // add new trade entry in trades collection
    if (newTrade) await new Trades(data).save();
    else {
      await Trades.updateOne({ _id: data.tradeId }, data);
    }
    return {
      data: { message: MSG.SUBMITTED, status: "Success" },
      status: 200,
    };
  } catch (error) {
    // throw error
    throw error;
  }
};

// add trades
exports.addTrades = async (req, res, next) => {
  try {
    let data = req.body;
    let result;
    if (data.type === MSG.SOLD) {
      result = await soldTypeTrade(data);
    } else if (data.type === MSG.BUY) {
      result = await buyTypeTrade(data);
    }

    handleResponse.success(res, result.data, result.status);
  } catch (error) {
    handleResponse.error(
      res,
      new APIError({
        message: MSG.SAVED_ERROR,
        errors: error,
        status: 400,
      })
    );
  }
};

// fetch trades
exports.fetchTrades = async (req, res, next) => {
  try {
    let { tradeId } = req.query;
    let result;
    if (tradeId) {
      // if request came for a specific trade detail only
      result = await Trades.find({ _id: tradeId });
    } else {
      // fetch all the trades
      result = await Trades.find();
    }

    handleResponse.success(res, result, 200);
  } catch (error) {
    handleResponse.error(
      res,
      new APIError({
        message: MSG.SAVED_ERROR,
        errors: error,
        status: 400,
      })
    );
  }
};

// fetch trades
exports.deleteTrades = async (req, res, next) => {
  try {
    let { tradeId } = req.query;
    // if request came for a specific trade detail only
    if (tradeId) {
      let result = await Trades.find({ _id: tradeId });
      let portfolio = await UserPortfolio.find({
        userId: result[0].userId,
        ticker: result[0].ticker,
      });

      if (result.length && portfolio.length) {
        // if trade exists
        if (result[0].type === MSG.BUY) {
          // if the trade type is buy
          if (portfolio[0].shares >= result[0].shares) {
            // only if existing security shares are greater
            // Update average value and share count
            let avg =
              (portfolio[0].avgValue * portfolio[0].shares -
                result[0].price * result[0].shares) /
                portfolio[0].shares +
              result[0].shares;
            let shares = portfolio[0].shares - result[0].shares;

            await updatePortfolio(result[0].userId, result[0].ticker, {
              avgValue: avg,
              shares: shares,
            });

            await Trades.findOneAndRemove({ _id: tradeId });

            handleResponse.success(
              res,
              { message: MSG.DELETED, status: MSG.SUCCESS },
              200
            );
          } else {
            handleResponse.error(
              res,
              new APIError({
                message: MSG.DELETE_ERROR,
                errors: error,
                status: 403,
              })
            );
          }
        } else if (result[0].type === MSG.SOLD) {
          // if type is sold

          // only update share counts, average will be as it is
          await updatePortfolio(result[0].userId, result[0].ticker, {
            shares: portfolio[0].shares + result[0].shares,
          });

          await Trades.findOneAndRemove({ _id: tradeId });

          handleResponse.success(
            res,
            { message: MSG.DELETED, status: MSG.SUCCESS },
            200
          );
        }
      } else {
        handleResponse.error(
          res,
          new APIError({
            message: MSG.NOT_FOUND,
            errors: error,
            status: 400,
          })
        );
      }
    } else {
      handleResponse.success(
        res,
        { message: MSG.TRADE_ID_REQUIRED, status: MSG.FAILED },
        403
      );
    }
  } catch (error) {
    console.log("error", error);

    handleResponse.error(
      res,
      new APIError({
        message: MSG.DELETE_ERROR,
        errors: error,
        status: 400,
      })
    );
  }
};

exports.updateTrades = async (req, res, next) => {
  try {
    let data = req.body;
    data.shares = parseFloat(data.shares);
    data.price = parseFloat(data.price);
    // if request came for a specific trade detail only
    if (data.tradeId) {
      // get existing trade
      let prevTrade = await Trades.find({ _id: data.tradeId });
      if (prevTrade.length) {
        if (
          data.ticker &&
          data.ticker !== prevTrade[0].ticker &&
          data.userId &&
          data.userId !== prevTrade[0].userId
        ) {
          // update ticker, it similar to add new trades
          let result;
          if (data.type === MSG.SOLD) {
            result = await soldTypeTrade(data, false);
          } else if (data.type === MSG.BUY) {
            result = await buyTypeTrade(data, false);
          }

          handleResponse.success(res, result.data, result.status);
        } else {
          let portfolio = await UserPortfolio.find({
            userId: prevTrade[0].userId,
            ticker: prevTrade[0].ticker,
          });
          let updatedShares, updatedAvg;

          if (data.type && data.type === prevTrade[0].type) {
            // type is same, check for average value and shares
            if (prevTrade[0].type === MSG.BUY) {
              updatedShares =
                portfolio[0].shares - prevTrade[0].shares + data.shares;
              updatedAvg =
                (portfolio[0].avgValue * portfolio[0].shares -
                  prevTrade[0].price * prevTrade[0].shares +
                  data.price * data.shares) /
                updatedShares;
            } else {
              updatedShares =
                portfolio[0].shares + prevTrade[0].shares - data.shares;
              updatedAvg = portfolio[0].avgValue;
            }
          } else {
            // update type
            if (data.type === MSG.SOLD) {
              if (data.shares <= portfolio[0].shares) {
                updatedAvg =
                  (portfolio[0].avgValue * portfolio[0].shares -
                    prevTrade[0].price * prevTrade[0].shares) /
                  (portfolio[0].shares + prevTrade[0].shares);

                updatedShares = portfolio[0].shares - data.shares;
              } else {
                handleResponse.error(
                  res,
                  new APIError({
                    message: MSG.UPDATE_ERROR,
                    errors: error,
                    status: 403,
                  })
                );
              }
            } else {
              updatedShares = portfolio[0].shares + data.shares;

              updatedAvg =
                (portfolio[0].shares * portfolio[0].avgValue +
                  data.shares * data.price) /
                updatedShares;
            }
          }

          if (updatedShares >= 0) {
            await updatePortfolio(portfolio[0].userId, portfolio[0].ticker, {
              avgValue: updatedAvg,
              shares: updatedShares,
            });

            await Trades.findOneAndUpdate({ _id: data.tradeId }, data);

            handleResponse.success(
              res,
              { message: MSG.TRADE_UPDATED, status: MSG.SUCCESS },
              200
            );
          } else {
            handleResponse.error(
              res,
              new APIError({
                message: MSG.UPDATE_ERROR,
                errors: error,
                status: 403,
              })
            );
          }
        }
      } else {
        handleResponse.success(
          res,
          { message: MSG.TRADE_NOT_FOUND, status: MSG.FAILED },
          403
        );
      }
    } else {
      handleResponse.success(
        res,
        { message: MSG.TRADE_ID_REQUIRED, status: MSG.FAILED },
        403
      );
    }
  } catch (error) {
    console.log(error);
    handleResponse.error(
      res,
      new APIError({
        message: MSG.DELETE_ERROR,
        errors: error,
        status: 400,
      })
    );
  }
};
