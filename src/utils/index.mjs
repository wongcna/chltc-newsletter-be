import bcrypt from 'bcryptjs';

export const handleHashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

export const comparePassword = async (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword)
}