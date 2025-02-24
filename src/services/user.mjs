//import { User } from '../mongoose/schema/user.mjs';
//import { hashPassword } from '../utils/helper.mjs';
import { sql } from "../config/db.mjs";
import { appError } from "../middleware/globalErrorHandler.mjs";
import { comparePassword, handleHashPassword } from "../utils/index.mjs";

export const signup = async (req, res, next) => {
  /* #swagger.parameters = [{
    "name": "Authorization",
    "in": "header",
    "required": true,
    "type": "string"
  }] */
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

export const updateUser = async (req, res, next) => {
  /* #swagger.parameters = [{
    "name": "Authorization",
    "in": "header",
    "required": true,
    "type": "string"
  }] */
  try {
    const { username, password, adminlevel, note } = req.body;
    console.log({ username, password, adminlevel, note });
    const userQuery = `SELECT * FROM tblStaff WHERE username = @username`;
    const userRequest = new sql.Request();
    userRequest.input('username', sql.NVarChar, username);
    const userResult = await userRequest.query(userQuery);

    const userFound = userResult?.recordset?.[0];
    console.log({ userFound });
    if (!userFound) {
      return next(appError('Email not exists', 409))
    }
        
    if (adminlevel === null || adminlevel === undefined) {
      adminlevel = userFound.adminlevel;
    }
    if (note === null || note === undefined) {
      note = userFound.note;
    }

    const hashPassword = await handleHashPassword(password);

    const result = await sql.query`
    UPDATE tblStaff 
    SET password=${hashPassword}, adminlevel=${adminlevel}, note=${note}
    WHERE username = ${username}`;
    console.log({ result });
    console.log({ rowsAffected: result.rowsAffected });
    if (result?.rowsAffected > 0) {
      return res.status(201).json({
        ok: true,
        message: `User ${username} password updated successfully! `
      });
    } else {
      return next(appError(`Failed to update user ${username} password.`, 500));
    }
  } catch (error) {
    next(appError(error.message))
  }
};


// export const getUsers = async () => {
//   return await User.find();
// };

// export const createUser = async (userData) => {
//   const { email, password, role } = userData;
//   if (!password || !email) {
//     throw new Error('password & email required');
//   }
//   const hashedPassword = hashPassword(password);
//   const user = new User({ email, password: hashedPassword, role });
//   return await user.save();
// };

// export const updateUser = async (id, updateData) => {
//   if (updateData.password){
//     updateData.password = hashPassword(updateData.password);
//   }
//   return await User.findByIdAndUpdate(id, updateData, { new: true });
// };

// export const deleteUser = async (id) => {
//   return await User.findByIdAndDelete(id);
// };

// export const getUserById = async (id) => {
//   return await User.findById(id);
// };
