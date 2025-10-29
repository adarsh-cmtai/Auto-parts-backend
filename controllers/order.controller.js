import * as orderService from '../services/order.service.js';

export const createOrder = async (req, res) => {
    try {
        const { addressId } = req.body;
        const newOrder = await orderService.createOrderService(req.user._id, addressId);
        res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await orderService.getMyOrdersService(req.user._id);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderByIdService(req.params.orderId, req.user._id);
        res.status(200).json(order);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getAllOrdersAdmin = async (req, res) => {
    try {
        const result = await orderService.getAllOrdersAdminService(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatusAdmin = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await orderService.updateOrderStatusAdminService(req.params.orderId, status);
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};