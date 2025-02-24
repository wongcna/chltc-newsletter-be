import { Router } from "express";
import authRouter from './auth.mjs';
import { isLogin } from "../utils/isLogin.mjs";
import scheduleNewsletters from './scheduleNewsletters.mjs';
import newsletterTemplatesRouter from './newsletterTemplates.mjs';
import { sendNewsletters } from "../services/sendNewsletters.mjs";
import { getCategories, getMembers } from "../services/categories.mjs";
import userRouter from './users.mjs';

const router = Router();

router.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});
router.get('/health', (req, res) => {
    res.json({ message: 'healthy' });
});

router.use('/auth', authRouter)
router.use(isLogin)
router.use('/users', userRouter);
router.get('/members', getMembers);
router.get('/categories', getCategories);
router.post('/send-newsletter', sendNewsletters);
router.use('/schedule-newsletters', scheduleNewsletters);
router.use('/newsletter-templates', newsletterTemplatesRouter);

export default router