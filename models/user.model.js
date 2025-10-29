import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const addressSchema = new mongoose.Schema({
    label: { type: String, required: true, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
});

const cartItemSchema = new mongoose.Schema({
    part: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Part',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobile: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  active: { type: Boolean, default: true },
  avatar: {
    type: String,
    default: 'https://default-avatar-url.com/default.png'
  },
  addresses: [addressSchema],
  cart: [cartItemSchema],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Part',
  }],
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
}, { timestamps: true });

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateForgotPasswordToken = function () {
  const token = crypto.randomBytes(20).toString('hex');
  this.forgotPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.forgotPasswordExpiry = Date.now() + 10 * 60 * 1000;
  return token;
};

export const User = mongoose.model('User', userSchema);

const pendingUserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpiry: { type: Date, required: true },
}, { timestamps: true });

export const PendingUser = mongoose.model('PendingUser', pendingUserSchema);