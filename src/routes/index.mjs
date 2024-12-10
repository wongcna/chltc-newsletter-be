import { Router } from "express";
import authRouter from './auth.mjs';
import newsletterTemplatesRouter from './newsletter-templates.mjs';

const router = Router();
router.use('/auth', authRouter)
router.use('/newsletter-templates', newsletterTemplatesRouter);

export default router