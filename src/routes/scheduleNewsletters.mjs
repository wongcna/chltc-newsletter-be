import express from 'express';

import {
  getNewsletterSchedules,
  updateNewsletterSchedule,
  createNewsletterSchedule,
  getNewsletterScheduleById,
  deleteNewsletterScheduleById,
} from '../services/scheduleNewsletters .mjs';

const router = express.Router();

router.route('/')
  .get(getNewsletterSchedules)
  .post(createNewsletterSchedule);

router.route('/:id')
  .get(getNewsletterScheduleById)
  .patch(updateNewsletterSchedule)
  .delete(deleteNewsletterScheduleById);

export default router;
