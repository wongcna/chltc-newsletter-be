import express from 'express';

import {
  getNewsletterTemplates,
  updateNewsletterTemplate,
  deleteNewsletterTemplate,
  createNewsletterTemplate,
  getNewsletterTemplateById,
} from '../services/newsletterTemplates.mjs';

const router = express.Router();

router.route('/')
  .get(getNewsletterTemplates)
  .post(createNewsletterTemplate);

router.route('/:id')
  .get(getNewsletterTemplateById)
  .patch(updateNewsletterTemplate)
  .delete(deleteNewsletterTemplate);

export default router;
