import express from "express";
import { UserModel } from "../db/users";
import { authentication, random } from "../helpers/authHelpers";
import { json } from "body-parser";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const allUsers = await UserModel.find().select(
      "+authentication.salt +authentication.password"
    );
    return res.status(200).json({ data: allUsers });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);
    return res.status(200).json({ data: deletedUser });
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ msg: "Values needed to update" });
    }

    const user = await getUserById(id);

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const updatedUser = await updateUserById(id, { username });

    return res
      .status(200)
      .json({ msg: "Update successfull", data: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error updating user" });
  }
};

export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);
    console.log(user);
    if (!user) {
      return res.status(400).json({ msg: "User does not exist for given ID" });
    }

    return res
      .status(200)
      .json({ msg: "user fetched successfully", data: user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error fetching user" });
  }
};

// * Helper calls
export const getUserByEmail = (email: string) => UserModel.findOne({ email });

export const deleteUserById = (id: string) => UserModel.deleteOne({ _id: id });

export const getUserById = (id: string) => UserModel.findById(id);

export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
