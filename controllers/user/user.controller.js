import * as userService from '../../services/user.service.js';

export const getUserProfile = async (req, res) => {
    try {
        const user = await userService.getUserProfileService(req.user._id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await userService.updateUserProfileService(req.user._id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getProfileUploadUrl = async (req, res) => {
    try {
        const { contentType } = req.query;
        const urls = await userService.generateProfileUploadUrlService(contentType);
        res.status(200).json(urls);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateUserAvatar = async (req, res) => {
    try {
        const { avatarUrl } = req.body;
        const updatedUser = await userService.updateUserAvatarService(req.user._id, avatarUrl);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const result = await userService.changePasswordService(req.user._id, oldPassword, newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAddresses = (req, res) => {
    res.status(200).json(req.user.addresses);
};

export const addAddress = async (req, res) => {
    try {
        const updatedAddresses = await userService.addAddressService(req.user._id, req.body);
        res.status(201).json(updatedAddresses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const updatedAddresses = await userService.updateAddressService(req.user._id, req.params.addressId, req.body);
        res.status(200).json(updatedAddresses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const updatedAddresses = await userService.deleteAddressService(req.user._id, req.params.addressId);
        res.status(200).json(updatedAddresses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const setDefaultAddress = async (req, res) => {
    try {
        const updatedAddresses = await userService.setDefaultAddressService(req.user._id, req.params.addressId);
        res.status(200).json(updatedAddresses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};