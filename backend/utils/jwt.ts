import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ userId }, secret, {
    expiresIn: '7d',
  });
};
