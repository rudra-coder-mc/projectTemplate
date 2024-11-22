import { Request } from 'express';

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  role: 'user' | 'admin' | 'super-admin';
}

interface IUser extends Document {
  username: string;
  email: string;
  fullName: string;
  googleId: string;
  avatar: string;
  password: string;
  role: 'user' | 'admin' | 'super-admin';
  refreshToken?: string;

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// Extend the `Request` interface to include the `user` property
interface CustomUser extends Request {
  user: User; // This is how you extend the `Request` type to include the `user` property
}

export { User, IUser, CustomUser };
