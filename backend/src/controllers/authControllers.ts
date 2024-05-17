import express from "express";
import { UserModel } from "../db/users";
import { authentication, random } from "../helpers/authHelpers";
import { getUserByEmail } from "./userController";

export const registerUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Please enter all details" });
    }

    // Check if username already exists
    const user = await UserModel.find({ username });

    const userEmail = await UserModel.find({ email });

    if (user.length !== 0) {
      return res.status(400).json({ msg: `User ${username} already exists!` });
    }
    if (userEmail.length !== 0) {
      return res.status(400).json({ msg: `Email ${email} already exists!` });
    }

    // Generate salt
    const salt = random();

    const newUser = await UserModel.create({
      username: username,
      email: email,
      authentication: {
        password: authentication(salt, password),
        salt: salt,
      },
    });

    return res.status(200).json({ msg: "New user registered", data: newUser });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const loginUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all details" });
    }

    // Check if username already exists
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res
        .status(400)
        .json({ msg: `Account with ${email} does not exist` });
    }

    // compare query password HASH and stored password HASH
    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.status(400).json({ msg: `Incorrect password` });
    }

    // if login success, set session token
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    // set COOKIE
    res.cookie("SHADY_AUTH", user.authentication.sessionToken, {
      domain: "localhost",
    });

    return res.status(200).json({ msg: "Login success", data: user }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getUserBySessionToken = async (sessionToken: string) => {
  try {
    const user = await UserModel.findOne({
      "authentication.sessionToken": sessionToken,
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.log(error);
  }
};

export const logoutUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Email needed!" });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(403).json({ msg: "User does not exist" });
    }
    // Delet sessiontoken from DB
    user.authentication.sessionToken = "";
    user.save();
    // CLear cookies
    res.clearCookie("SHADY_AUTH");

    return res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error logging out" });
  }
};
