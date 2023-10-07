import ConnectionModel from "./../models/connection.model.js";

export const newConnection = async (req, res) => {
  try {
    const { userOneId, userOneName, userTwoId, userTwoName } = req.body;
    const oldConnection = await ConnectionModel.find({
      userOneId: { $in: [userOneId, userTwoId] },
      userTwoId: { $in: [userOneId, userTwoId] },
      status: 1,
    });
    if (oldConnection.length !== 0) {
      return res.status(200).json({
        message: "Connection Already Present.",
      });
    }
    const newConnection = new ConnectionModel({
      userOneId: userOneId,
      userOneName: userOneName,
      userTwoId: userTwoId,
      userTwoName: userTwoName,
      status: 1,
    });
    newConnection.save();
    res.status(200).json({
      message: "Connection Added Successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getConnections = async (req, res) => {
  try {
    const { userId } = req.body;
    const connectionList = await ConnectionModel.find({
      $and: [
        { status: 1 },
        {
          $or: [{ userOneId: userId }, { userTwoId: userId }],
        },
      ],
    });
    res.status(200).json({
      message: "Connections Fetched Successfully.",
      connectionList: connectionList,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
