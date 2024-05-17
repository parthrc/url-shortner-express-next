import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authControllers";
import express from "express";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
