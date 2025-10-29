import * as adminService from '../../services/admin.service.js';

export const getAllCustomers = async (req, res) => {
    try {
        const result = await adminService.getAllCustomersService(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch customers', error: error.message });
    }
};

export const getCustomerById = async (req, res) => {
    try {
        const customer = await adminService.getCustomerByIdService(req.params.id);
        res.status(200).json(customer);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateCustomer = async (req, res) => {
    try {
        const updatedCustomer = await adminService.updateCustomerService(req.params.id, req.body);
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const result = await adminService.deleteCustomerService(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const sendEmailToCustomers = async (req, res) => {
    try {
        const { customerIds, subject, htmlContent } = req.body;
        const result = await adminService.sendEmailToCustomersService(customerIds, subject, htmlContent);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};