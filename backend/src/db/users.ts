import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },

    authentication: {
      password: {
        type: String,
        required: true,
        select: false,
      },
      salt: {
        type: String,
        select: false,
      },
      sessionToken: {
        type: String,
        select: false,
      },
    },
    links: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Url",
          localField: "_id",
          foreignField: "owner",
        },
      ],
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", UserSchema);
