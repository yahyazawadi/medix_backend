import jwt from 'jsonwebtoken';

const secretKey = 'whatwashernameagain';  // Use a strong secret key and keep it safe

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  };

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
