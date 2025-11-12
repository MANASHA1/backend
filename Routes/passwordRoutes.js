import express from "express";
import { createPassword, getPasswords, updatePassword, deletePassword } from "../controllers/passwordController.js";

const router = express.Router();

router.post("/", createPassword);
router.get("/", getPasswords);
router.put("/:id", updatePassword);
router.delete("/:id", deletePassword);

export default router;
