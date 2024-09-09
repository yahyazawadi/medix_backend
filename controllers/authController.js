import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the email exists in the Admin collection
        let user = await Admin.findOne({ email });
        let isAdmin = true;

        // If not found in Admin, check in User collection
        if (!user) {
            user = await User.findOne({ email });
            isAdmin = false;
        }

        // If user or admin not found, return unauthorized
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the entered password with the stored hashed password for both users and admins
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, isAdmin }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Set the token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'None',
        });

        // Return success message
        res.status(200).json({ message: 'Login successful', isAdmin });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const refresh = (req, res) => {
    // Refresh logic for token
    res.status(200).json({ message: 'Token refreshed' });
};

const logout = (req, res) => {
    // Clear token cookie
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
    });
    res.status(200).json({ message: 'Logout successful' });
};

export default { login, refresh, logout };
