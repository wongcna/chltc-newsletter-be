import { appError } from "../middleware/globalErrorHandler.mjs";

export const createNewsletterTemplate = async (req, res, next) => {
  try {
    return res.json({ data: {}, message: 'Newsletter template created successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};

export const getNewsletterTemplates = async (req, res, next) => {
  try {
    return res.json({ data: {}, message: 'Newsletter templates fetched successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};

export const getNewsletterTemplateById = async (req, res, next) => {
  try {
    return res.json({ data: {}, message: 'Newsletter template fetchedById successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};

export const updateNewsletterTemplate = async (req, res, next) => {
  try {
    return res.json({ data: {}, message: 'Newsletter template updated successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};

export const deleteNewsletterTemplate = async (req, res, next) => {
  try {
    return res.json({ data: {}, message: 'Newsletter template deleted successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};