import { sql } from "../config/db.mjs";
import { appError } from "../middleware/globalErrorHandler.mjs";

export const getCategories = async (req, res, next) => {
  /* #swagger.parameters = [{
    "name": "Authorization",
    "in": "header",
    "required": true,
    "type": "string"
  }] */

  const staticCategories = [
    {
      "MCID": 21,
      "CAT_DESC": "All Members",
    },
    {
      "MCID": 22,
      "CAT_DESC": "All Comms Subscribers",
    },
    {
      "MCID": 23,
      "CAT_DESC": "Ladders Subscribers",
    },
  ];
  try {
    const query = 'SELECT * FROM tblMembershipCategories';
    const result = await sql.query(query);
    const allCategories = [...staticCategories, ...result?.recordset];
    res.status(200).json({ data: allCategories, message: 'Categories fetched successfully!' });
  } catch (error) {
    next(appError(error.message))
  }
};

export const getMembers = async (req, res, next) => {
  /* #swagger.parameters = [{
    "name": "Authorization",
    "in": "header",
    "required": true,
    "type": "string"
  }] */
  try {
    const { category } = req.query;
    let query = ""

    if (category == 21) {
      query = `
      SELECT FNAME, SNAME, EMAIL
      FROM qryLiveMembersAgeCatEmailComms
    `;
    }
    else if (category == 22) {
      query = `
      SELECT FNAME, SNAME, EMAIL
      FROM qryLiveMembersAgeCatEmailComms
      WHERE CommsEvent = 1
    `;
    }
    else if (category == 23) {
      query = `
      SELECT FNAME, SNAME, EMAIL
      FROM qryLiveMembersAgeCatEmailComms
      WHERE CommsLadderTour = 1
    `;
    }
    else {
      query = `
      SELECT FNAME, SNAME, EMAIL
      FROM qryLiveMembers
      WHERE DateResigned IS NULL
        AND EMAIL IS NOT NULL
        AND MCID = ${category}
    `;
    }


    const result = await sql.query(query);
    res.status(200).json({ data: result?.recordset, message: 'Members fetched successfully!' });
  } catch (error) {
    next(appError(error.message))
  }
};