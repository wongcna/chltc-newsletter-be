import { Router } from "express";
import authRouter from './auth.mjs';
import { getCategories } from "../services/categories.mjs";
import scheduleNewsletters from './scheduleNewsletters.mjs';
import newsletterTemplatesRouter from './newsletterTemplates.mjs';
import { sendNewsletters } from "../services/sendNewsletters.mjs";

const router = Router();

router.use('/auth', authRouter)
router.get('/categories', getCategories);
router.post('/send-newsletter', sendNewsletters);
router.use('/schedule-newsletters', scheduleNewsletters);
router.use('/newsletter-templates', newsletterTemplatesRouter);

export default router