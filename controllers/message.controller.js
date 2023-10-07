import MessageModel from "./../models/message.model.js";

export const getChatMessages = async (req, res) => {
  try {
    const { sender, recipient } = req.body;
    // await MessageModel.deleteMany({});
    const chatMessages = await MessageModel.find({
      sender: { $in: [sender, recipient] },
      recipient: { $in: [sender, recipient] },
    }).sort({ createdAt: 1 });
    // console.log(chatMessages);
    res.status(200).json({
      message: "Messages Fetched Successfully.",
      chatMessages: chatMessages,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
