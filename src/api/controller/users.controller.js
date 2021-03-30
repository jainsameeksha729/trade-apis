const Users = require("../models/users.model");
const { MSG } = require("../utils/messages");
const handleResponse = require("../utils/handleResponse");
const APIError = require("../utils/APIError");
const axios = require("axios");

exports.addUser = async (req, res, next) => {
  try {
    let { name } = req.body;
    await new Users({name: name}).save();
    handleResponse.success(res, { message: MSG.USER_ADD, status: "Success" }, 200);
  } catch (error) {
    console.log(error)
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

exports.getDetail = async (req, res, next) => {
  try {
    let { userId } = req.query;

      let data = await Users.find({ _id: userId });
      if(data.length){
        handleResponse.success(res, data, 200);

      }else{
        handleResponse.success(res, {message: MSG.USER_NOT_FOUND, status: MSG.FAILED}, 403);

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
