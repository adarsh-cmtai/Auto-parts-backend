import { User } from '../models/user.model.js';
import { getSignedUploadUrl } from '../utils/s3.js';
import sendEmail from '../utils/email.js';

export const generateAdminUploadUrlService = async (contentType) => {
    if (!contentType) {
        throw new Error("File content type is required");
    }
    return await getSignedUploadUrl(contentType);
};

export const updateAdminAvatarService = async (adminId, avatarUrl) => {
    if (!avatarUrl) {
        throw new Error("Avatar URL is required");
    }
    const admin = await User.findByIdAndUpdate(adminId, { avatar: avatarUrl }, { new: true }).select('-password -addresses');
    if (!admin) {
        throw new Error("Admin not found");
    }
    return admin;
};

export const getAdminProfileService = async (adminId) => {
    const admin = await User.findById(adminId).select('-password -addresses');
    if (!admin || admin.role !== 'ADMIN') {
        throw new Error('Admin not found');
    }
    return admin;
};

export const updateAdminProfileService = async (adminId, updateData) => {
    const { fullName, mobile } = updateData;
    if (mobile) {
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile)) {
            throw new Error('Invalid mobile number format');
        }
    }
    const admin = await User.findByIdAndUpdate(adminId, { fullName, mobile }, { new: true, runValidators: true }).select('-password -addresses');
    if (!admin) throw new Error('Admin not found');
    return admin;
};

export const changeAdminPasswordService = async (adminId, oldPassword, newPassword) => {
    const admin = await User.findById(adminId);
    if (!admin) throw new Error('Admin not found');

    const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new Error('Incorrect current password');
    }

    if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
    }

    admin.password = newPassword;
    await admin.save();
    return { message: 'Password updated successfully' };
};


export const getAllCustomersService = async (options) => {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = options;

    const query = { role: 'USER' };
    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const users = await User.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .select('-password -forgotPasswordToken -forgotPasswordExpiry');

    const totalCustomers = await User.countDocuments(query);

    return {
        customers: users,
        totalPages: Math.ceil(totalCustomers / limit),
        currentPage: parseInt(page),
        totalCustomers,
    };
};

export const getCustomerByIdService = async (customerId) => {
    const customer = await User.findOne({ _id: customerId, role: 'USER' }).select('-password');
    if (!customer) {
        throw new Error('Customer not found');
    }
    return customer;
};

export const updateCustomerService = async (customerId, updateData) => {
    const allowedUpdates = ['fullName', 'mobile', 'active'];
    const updates = {};
    for (const key in updateData) {
        if (allowedUpdates.includes(key)) {
            updates[key] = updateData[key];
        }
    }

    const customer = await User.findByIdAndUpdate(customerId, updates, { new: true, runValidators: true }).select('-password');
    if (!customer) {
        throw new Error('Customer not found');
    }
    return customer;
};

export const deleteCustomerService = async (customerId) => {
    const customer = await User.findOneAndDelete({ _id: customerId, role: 'USER' });
    if (!customer) {
        throw new Error('Customer not found');
    }
    return { message: 'Customer deleted successfully' };
};

export const sendEmailToCustomersService = async (customerIds, subject, htmlContent) => {
    if (!customerIds || customerIds.length === 0 || !subject || !htmlContent) {
        throw new Error('Customer IDs, subject, and content are required.');
    }

    const customers = await User.find({ _id: { $in: customerIds }, role: 'USER' });
    if (customers.length === 0) {
        throw new Error('No valid customers found for the provided IDs.');
    }

    const emails = customers.map(customer => customer.email);

    await sendEmail({
        email: emails.join(','),
        subject: subject,
        html: htmlContent,
    });

    return { message: `Email successfully sent to ${emails.length} customer(s).` };
};