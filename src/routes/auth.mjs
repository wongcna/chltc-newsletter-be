import { Router } from "express";
import { login, logout } from "../services/auth.mjs";

const router = Router();

router.post('/login', login);
// router.post('/signup', signup);
router.post('/logout', logout)

export default router