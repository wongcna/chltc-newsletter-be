import { sql } from "../config/db.mjs";
import { appError } from "../middleware/globalErrorHandler.mjs";

export const createNewsletterTemplate = async (req, res, next) => {
  try {
    const { Subject, EmailBody } = req.body;

    if (!Subject || !EmailBody) {
      return next(appError('Subject and EmailBody are required fields!', 400));
    }

    const result = await sql.query`
    INSERT INTO tblNewsletters (Subject, EmailBody)
    VALUES (${Subject}, ${EmailBody})
    SELECT * FROM tblNewsletters WHERE Subject = ${Subject} AND EmailBody = ${EmailBody}
  `;

    if (result?.recordset && result.recordset.length > 0) {
      return res.status(201).json({
        data: result.recordset[0],
        message: 'Newsletter template created successfully!'
      });
    } else {
      return next(appError('Failed to create the newsletter template.', 500));
    }
  } catch (error) {
    next(appError(error.message))
  }
};

export const getNewsletterTemplates = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;

    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM tblNewsletters';
    let countQuery = 'SELECT COUNT(*) AS total FROM tblNewsletters';
    let params = [];

    if (search) {
      query += ' WHERE Subject LIKE @search';
      countQuery += ' WHERE Subject LIKE @search';
      params.push({
        name: 'search',
        type: sql.NVarChar,
        value: `%${search}%`
      });
    }

    query += ' ORDER BY SSMA_TimeStamp DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
    params.push(
      {
        name: 'offset',
        type: sql.Int,
        value: offset
      },
      {
        name: 'limit',
        type: sql.Int,
        value: limit
      }
    );

    const request = new sql.Request();
    params.forEach(param => {
      request.input(param.name, param.type, param.value);
    });

    // Fetch the results
    const result = await request.query(query);
    const totalResult = await request.query(countQuery);

    // Calculate total pages
    const totalRecords = totalResult?.recordset[0]?.total || 0;
    const totalPages = Math.ceil(totalRecords / limit);

    return res.json({
      data: result?.recordset,
      totalRecords,
      totalPages,
      currentPage: parseInt(page),
      message: 'Newsletter templates fetched successfully!'
    });

  } catch (error) {
    next(appError(error.message));
  }
};

export const getNewsletterTemplateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await sql.query`SELECT * FROM tblNewsletters WHERE ID = ${id}`;

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    return res.json({ data: result.recordset[0], message: 'Newsletter template fetchedById successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};

export const updateNewsletterTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Subject, EmailBody } = req.body;

    const result = await sql.query`
      UPDATE tblNewsletters
      SET Subject = ${Subject}, EmailBody = ${EmailBody}
      WHERE ID = ${id}`;

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Newsletter template not found' });
    }

    const updatedResult = await sql.query`
      SELECT * FROM tblNewsletters WHERE ID = ${id}
    `;

    return res.json({ data: updatedResult.recordset[0], message: 'Newsletter template updated successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};

export const deleteNewsletterTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await sql.query`DELETE FROM tblNewsletters WHERE ID = ${id}`;
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }
    return res.json({ data: {}, message: 'Newsletter template deleted successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};