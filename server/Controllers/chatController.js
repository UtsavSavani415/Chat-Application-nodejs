const chatModel = require("../Models/chatModel");

// create chat

// get user chat

//find chat

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) {
      return res.status(200).json(chat);
    }

    const newChat = new chatModel({
      members: [firstId, secondId],
    });
  } catch (error) {
    console.log("error while creating chat", error);
    res.status(500).json(error);
  }
};
