import { Router, Request, Response } from "express";
import {
  register,
  login,
  sendOtp,
  verifyOtpAndResetPassword,
  updateUser,
  deleteUser,
} from "../controllers/authController";
import { User } from "../entities/User";
import { AppDataSource } from "../config/database";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-code", sendOtp);
router.post("/verify-otp", verifyOtpAndResetPassword);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Get all users
router.get("/users", async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find(); // Get all users from the database

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
});

export default router;
