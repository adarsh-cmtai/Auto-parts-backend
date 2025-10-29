import * as enquiryService from '../services/enquiry.service.js';

export const createEnquiry = async (req, res) => {
    try {
        const enquiry = await enquiryService.createEnquiryService(req.body);
        res.status(201).json({ message: 'Your enquiry has been sent successfully!', enquiry });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await enquiryService.getAllEnquiriesService();
        res.status(200).json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEnquiryById = async (req, res) => {
    try {
        const enquiry = await enquiryService.getEnquiryByIdService(req.params.id);
        res.status(200).json(enquiry);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const replyToEnquiry = async (req, res) => {
    try {
        const { message } = req.body;
        const updatedEnquiry = await enquiryService.replyToEnquiryService(req.params.id, message);
        res.status(200).json(updatedEnquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};