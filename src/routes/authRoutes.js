import express from "express";
import { ethMessage, ethVerify, logout } from "../controllers/authController";

const router = express.Router();

router.post("/request-message", ethMessage);
router.post("/verify-signature", ethVerify);
router.get("/logout", logout);

export default router;
