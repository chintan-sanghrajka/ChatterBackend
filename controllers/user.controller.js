import UserModel from "./../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Return status
// status 1 = Username exists
// status 2 = Email exists
// status 3 = User not Found
// status 4 = Invalid Password
// status 5 = Success

export const checkUser = async (req, res) => {
  const { userName, emailId } = req.body;
  try {
    const oldUser = await UserModel.findOne({
      $and: [
        {
          userName: userName,
        },
        { status: 1 },
      ],
    });
    if (oldUser) {
      res.status(200).json({
        message: "User already exists.",
        status: 1,
      });
    } else {
      const oldEmail = await UserModel.findOne({
        $and: [{ emailId: emailId }, { status: 1 }],
      });
      if (oldEmail) {
        res.status(200).json({
          message: "Email already exists.",
          status: 2,
        });
      } else {
        res.status(200).json({
          message: "User not found.",
          status: 3,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addUser = async (req, res) => {
  try {
    const { firstName, lastName, userName, emailId, contact, password } =
      req.body;
    console.log(firstName, lastName, userName, emailId, contact, password);
    const newPassword = bcrypt.hashSync(password, 10);
    const newUser = new UserModel({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      emailId: emailId,
      password: newPassword,
      status: 1,
      contact: contact,
    });
    newUser.save();
    if (newUser) {
      res.status(201).json({
        message: "User created successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await UserModel.findOne({
      userName: userName,
      status: 1,
    });
    if (user === null) {
      return res.status(200).json({
        message: "User not Found.",
        status: 3,
      });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (validPassword) {
      const token = jwt.sign(
        {
          userId: user._id,
          userName: user.userName,
          emailId: user.emailId,
        },
        process.env.SECRET_KEY,
        { expiresIn: "12h" }
      );
      return res.status(200).json({
        message: "User Successfully logged in.",
        user: user,
        token: token,
        status: 5,
      });
    } else {
      return res.status(200).json({
        message: "Invalid Password",
        status: 4,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { userSearch } = req.body;
    const rgx = (pattern) => new RegExp(`^${pattern}.*`);
    const searchRgx = rgx(userSearch);
    const filterConfig = {
      status: 1,
      userName: { $regex: searchRgx, $options: "i" },
    };
    const userList = await UserModel.find(filterConfig, {
      _id: 1,
      userName: 1,
    });
    res.status(200).json({
      message: "Searched Users Fetched Successfully.",
      userList: userList,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
