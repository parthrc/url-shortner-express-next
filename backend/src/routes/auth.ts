import { isAuthenticated } from "../middleware/isAuthenticated";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authControllers";
import express from "express";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);

export default router;
