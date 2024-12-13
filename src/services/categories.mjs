import { categories } from "../mock/index.mjs";
import { appError } from "../middleware/globalErrorHandler.mjs";

export const getCategories = async (req, res, next) => {
  try {    
    res.status(200).json({ data: categories, message: 'Categories fetched successfully!' });
  } catch (error) {
    next(appError(error.message))
  }
};