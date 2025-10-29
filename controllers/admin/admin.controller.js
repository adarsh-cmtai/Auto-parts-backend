import * as adminService from '../../services/admin.service.js';

export const getAdminProfile = async (req, res) => {
    try {
        const admin = await adminService.getAdminProfileService(req.user._id);
        res.status(200).json(admin);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getAdminProfileUploadUrl = async (req, res) => {
    try {
        const { contentType } = req.query;
        const urls = await adminService.generateAdminUploadUrlService(contentType);
        res.status(200).json(urls);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateAdminAvatar = async (req, res) => {
    try {
        const { avatarUrl } = req.body;
        const updatedAdmin = await adminService.updateAdminAvatarService(req.user._id, avatarUrl);
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateAdminProfile = async (req, res) => {
    try {
        const updatedAdmin = await adminService.updateAdminProfileService(req.user._id, req.body);
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const changeAdminPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const result = await adminService.changeAdminPasswordService(req.user._id, oldPassword, newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};