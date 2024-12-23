import { sql } from "../config/db.mjs";
import { appError } from "../middleware/globalErrorHandler.mjs";

export const getCategories = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM tblMembershipCategories';
    const result = await sql.query(query);
    res.status(200).json({ data: result?.recordset, message: 'Categories fetched successfully!' });
  } catch (error) {
    next(appError(error.message))
  }
};

export const getMembers = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = `
    SELECT FNAME, SNAME, EMAIL 
    FROM tblMembers20240308
    WHERE DateResigned IS NULL 
      AND EMAIL IS NOT NULL
      AND MCID = ${category}
  `;

    const result = await sql.query(query);
    res.status(200).json({ data: result?.recordset, message: 'Members fetched successfully!' });
  } catch (error) {
    next(appError(error.message))
  }
};