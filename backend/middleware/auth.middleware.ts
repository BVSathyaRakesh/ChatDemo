import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({ success: false, message: 'Server configuration error' });
      return;
    }

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      req.userId = (decoded as { userId: string }).userId;
      next();
    } else {
      res.status(401).json({ success: false, message: 'Invalid token format' });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
