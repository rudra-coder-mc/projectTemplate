import { ApiError } from './ApiError';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateUserInput = (
  username: string,
  email: string,
  password: string
) => {
  if (!username || !email || !password)
    throw new ApiError(400, 'All fields are required');
  if (!isValidEmail(email)) throw new ApiError(400, 'Invalid email format');
  if (!isValidPassword(password)) {
    throw new ApiError(
      400,
      'Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character'
    );
  }
};
