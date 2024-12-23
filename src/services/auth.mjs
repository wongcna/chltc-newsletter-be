import { sql } from "../config/db.mjs";
import { appError } from "../middleware/globalErrorHandler.mjs";
import { comparePassword, handleHashPassword } from "../utils/index.mjs";
import { generateToken } from "../utils/token.mjs";

export const login = async (req, res, next) => {
  try {
    const { email = '', password = '' } = req.body;

    const query = `SELECT * FROM tblStaff WHERE username = @email`;
    const request = new sql.Request();
    request.input('email', sql.NVarChar, email);
    const result = await request.query(query);

    const userFound = result?.recordset?.[0];

    if (!userFound) {
      return next(appError('invalid credentials!', 403));
    }

    const isPasswordMatch = userFound ? (await comparePassword(password, userFound?.password ?? '')) : false;

    if (!userFound || !isPasswordMatch) {
      return next(appError('invalid credentials!', 403))
    }

    const user = {
      ...userFound,
      role: 'admin',
      isAdmin: true,
      token: generateToken(userFound._id)
    }

    return res.json({ data: user, message: 'user login successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};

export const signup = async (req, res, next) => {
  try {
    const { username = '', password = null, adminlevel = 0, note = null } = req.body;

    const userQuery = `SELECT * FROM tblStaff WHERE username = @username`;
    const userRequest = new sql.Request();
    userRequest.input('username', sql.NVarChar, username);
    const userResult = await userRequest.query(userQuery);

    const userFound = userResult?.recordset?.[0];

    if (userFound) {
      return next(appError('Email already exists', 409))
    }

    const hashPassword = await handleHashPassword(password);

    const result = await sql.query`
    INSERT INTO tblStaff (username, password, adminlevel, note) 
    VALUES (${username}, ${hashPassword}, ${adminlevel}, ${note})
    SELECT * FROM tblStaff WHERE username = ${username}`;

    if (result?.recordset && result.recordset.length > 0) {
      return res.status(201).json({
        data: result.recordset[0],
        message: 'User created successfully!'
      });
    } else {
      return next(appError('Failed to create the User.', 500));
    }

  } catch (error) {
    next(appError(error.message))
  }
};

export const logout = async (req, res, next) => {
  try {
    return res.json({ data: {}, message: 'logout successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};