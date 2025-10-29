import { User } from '../models/user.model.js';
import { getSignedUploadUrl } from '../utils/s3.js';
import bcrypt from 'bcryptjs';

export const getUserProfileService = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
};

export const updateUserProfileService = async (userId, updateData) => {
    const { fullName, mobile } = updateData;
    if (mobile) {
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile)) {
            throw new Error('Invalid mobile number format');
        }
    }
    const user = await User.findByIdAndUpdate(userId, { fullName, mobile }, { new: true, runValidators: true }).select('-password');
    if (!user) throw new Error('User not found');
    return user;
};

export const generateProfileUploadUrlService = async (contentType) => {
    if (!contentType) {
        throw new Error("File content type is required");
    }
    return await getSignedUploadUrl(contentType);
};

export const updateUserAvatarService = async (userId, avatarUrl) => {
    if (!avatarUrl) {
        throw new Error("Avatar URL is required");
    }
    const user = await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true }).select('-password');
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

export const changePasswordService = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new Error('Incorrect current password');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return { message: 'Password updated successfully' };
};

export const addAddressService = async (userId, addressData) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (addressData.isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(addressData);
    await user.save();
    return user.addresses;
};

export const updateAddressService = async (userId, addressId, addressData) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const address = user.addresses.id(addressId);
    if (!address) throw new Error('Address not found');

    if (addressData.isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    Object.assign(address, addressData);
    await user.save();
    return user.addresses;
};

export const deleteAddressService = async (userId, addressId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    const address = user.addresses.id(addressId);
    if (!address) throw new Error('Address not found');

    address.remove();
    await user.save();
    return user.addresses;
};

export const setDefaultAddressService = async (userId, addressId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.addresses.forEach(addr => addr.isDefault = false);
    const newDefault = user.addresses.id(addressId);
    if (!newDefault) throw new Error('Address not found');

    newDefault.isDefault = true;
    await user.save();
    return user.addresses;
};