import { User, PendingUser } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/email.js';
import crypto from 'crypto';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

export const registerUserService = async (userData) => {
    const { fullName, email, mobile, password } = userData;
    if (!fullName || !email || !mobile || !password) throw new Error('All fields are required');
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) throw new Error('Invalid mobile number format');
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) throw new Error('User with this email or mobile already exists');

    await PendingUser.deleteOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    await PendingUser.create({ fullName, email, mobile, password: hashedPassword, otp: hashedOtp, otpExpiry });
    const emailHtml = `<p>Welcome to OwnSilent! Your OTP is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`;
    await sendEmail({ email, subject: 'Verify Your Email - OwnSilent', html: emailHtml });
    return { message: 'OTP sent to your email. Please verify to complete registration.' };
};

export const verifyEmailService = async (email, otp) => {
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) throw new Error('No pending registration found. Please register again.');
    if (pendingUser.otpExpiry < Date.now()) {
        await PendingUser.deleteOne({ email });
        throw new Error('OTP has expired. Please register again.');
    }
    const isOtpValid = await bcrypt.compare(otp, pendingUser.otp);
    if (!isOtpValid) throw new Error('Invalid OTP.');

    const newUser = await User.create({
        fullName: pendingUser.fullName,
        email: pendingUser.email,
        mobile: pendingUser.mobile,
        password: pendingUser.password,
    });
    await PendingUser.deleteOne({ email });
    const token = generateToken(newUser._id);
    const userResponse = newUser.toObject();
    delete userResponse.password;
    return { message: 'Registration successful!', user: userResponse, token };
};

export const loginUserService = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new Error('Invalid email or password');
    }
    const token = generateToken(user._id);
    const userResponse = user.toObject();
    delete userResponse.password;
    return { user: userResponse, token };
};

export const forgotPasswordService = async (email) => {
    const user = await User.findOne({ email });
    if (!user) return { message: 'If a user with that email exists, a password reset link has been sent.' };
    const resetToken = user.generateForgotPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    const emailHtml = `<p>Click <a href="${resetUrl}">this link</a> to reset your password. This link is valid for 10 minutes.</p>`;
    await sendEmail({ email: user.email, subject: 'Password Reset Request - OwnSilent', html: emailHtml });
    return { message: 'If a user with that email exists, a password reset link has been sent.' };
};

export const resetPasswordService = async (token, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    });
    if (!user) throw new Error('Token is invalid or has expired');

    user.password = await bcrypt.hash(newPassword, 10);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    return { message: 'Password reset successful!' };
};