const messageModel = require("../Models/messageModel");

// create Message

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  const message = new messageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const response = await message.save();

    res.status(200).json(response);
  } catch (error) {
    console.log("error while creating message", error);
    res.status(500).json(error);
  }
};

// get message

const getMessage = async (req, res) => {
  const { chatId } = req.params;
  try {
    const message = await messageModel.find({ chatId });

    res.status(200).json(message);
  } catch (error) {
    console.log("error while creating message", error);
    res.status(500).json(error);
  }
};

module.exports = { createMessage, getMessage };
