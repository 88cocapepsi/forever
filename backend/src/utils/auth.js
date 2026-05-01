import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), username: user.username, role: user.role, name: user.name },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}
