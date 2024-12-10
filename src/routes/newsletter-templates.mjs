import express from 'express';

import {
  createNewsletterTemplate,
  getNewsletterTemplates,
  getNewsletterTemplateById,
  updateNewsletterTemplate,
  deleteNewsletterTemplate,
} from '../services/newsletter templates.mjs';

const router = express.Router();

router.route('/')
  .get(getNewsletterTemplates)
  .post(createNewsletterTemplate);

router.route('/:id')
  .get(getNewsletterTemplateById)
  .patch(updateNewsletterTemplate)
  .delete(deleteNewsletterTemplate);

export default router;
