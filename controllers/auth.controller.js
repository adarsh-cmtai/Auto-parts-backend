import * as authService from '../services/auth.service.js';

export const registerUser = async (req, res) => {
    try {
        const result = await authService.registerUserService(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await authService.verifyEmailService(email, otp);
        res.cookie('token', result.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(201).json({ user: result.user, message: result.message });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUserService(email, password);
        res.cookie('token', result.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({ user: result.user });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPasswordService(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const { password } = req.body;
        const result = await authService.resetPasswordService(token, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const logoutUser = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};