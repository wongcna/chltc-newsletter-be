import { Router } from "express";
import authRouter from './auth.mjs';
import { isLogin } from "../utils/isLogin.mjs";
import scheduleNewsletters from './scheduleNewsletters.mjs';
import newsletterTemplatesRouter from './newsletterTemplates.mjs';
import { sendNewsletters } from "../services/sendNewsletters.mjs";
import { getCategories, getMembers } from "../services/categories.mjs";

const router = Router();

router.use('/auth', authRouter)
router.use(isLogin)
router.get('/members', getMembers);
router.get('/categories', getCategories);
router.post('/send-newsletter', sendNewsletters);
router.use('/schedule-newsletters', scheduleNewsletters);
router.use('/newsletter-templates', newsletterTemplatesRouter);

export default router