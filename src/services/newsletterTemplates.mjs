import { sql } from "../config/db.mjs";
import { appError } from "../middleware/globalErrorHandler.mjs";

export const createNewsletterTemplate = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return next(appError('Title and content are required fields!', 400));
    }

    const result = await sql.query`
    INSERT INTO newsletter_templates (title, content) 
    VALUES (${title}, ${content})
    SELECT * FROM newsletter_templates WHERE title = ${title} AND content = ${content}
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
    const { search } = req.query;

    let query = 'SELECT * FROM newsletter_templates';
    let params = [];

    if (search) {
      query += ' WHERE title LIKE @search';
      params.push({
        name: 'search',
        type: sql.NVarChar,
        value: `%${search}%`
      });
    }

    const request = new sql.Request();
    params.forEach(param => {
      request.input(param.name, param.type, param.value);
    });

    const result = await request.query(query);

    return res.json({ data: result?.recordset, message: 'Newsletter templates fetched successfully!' });
  } catch (error) {
    next(appError(error.message));
  }
};

export const getNewsletterTemplateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await sql.query`SELECT * FROM newsletter_templates WHERE id = ${id}`;

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
    const { title, content } = req.body;

    const result = await sql.query`
      UPDATE newsletter_templates 
      SET title = ${title}, content = ${content} 
      WHERE id = ${id}
    `;

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Newsletter template not found' });
    }

    const updatedResult = await sql.query`
      SELECT * FROM newsletter_templates WHERE id = ${id}
    `;

    return res.json({ data: updatedResult.recordset[0], message: 'Newsletter template updated successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};

export const deleteNewsletterTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await sql.query`DELETE FROM newsletter_templates WHERE id = ${id}`;
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }
    return res.json({ data: {}, message: 'Newsletter template deleted successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};