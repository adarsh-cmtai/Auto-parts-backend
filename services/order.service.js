import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';
import { Part } from '../models/part.model.js';
import sendEmail from '../utils/email.js';
import crypto from 'crypto';

const generateOrderId = () => {
    return `OS-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
}

const formatEmailForAdmin = (order, user, itemsWithDetails) => {
    const itemsHtml = itemsWithDetails.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name} (SKU: ${item.sku})</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
        </tr>
    `).join('');

    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1 style="color: #333;">New Order Received: #${order.orderId}</h1>
            <p>You have received a new manual order. Please contact the customer to proceed.</p>
            
            <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px;">Customer Details</h2>
            <p><strong>Name:</strong> ${user.fullName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.mobile}</p>
            
            <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px;">Shipping Address</h2>
            <address style="font-style: normal;">
                ${order.shippingAddress.fullName}<br>
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
                ${order.shippingAddress.country}<br>
                Phone: ${order.shippingAddress.phone}
            </address>
            
            <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px;">Order Items</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="padding: 10px; border-bottom: 2px solid #333; text-align: left;">Product</th>
                        <th style="padding: 10px; border-bottom: 2px solid #333; text-align: center;">Quantity</th>
                        <th style="padding: 10px; border-bottom: 2px solid #333; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <h3 style="text-align: right; color: #333;">Total Amount: ₹${order.totalAmount.toLocaleString('en-IN')}</h3>
            
            <p style="margin-top: 20px;">Please log in to the admin dashboard to manage this order.</p>
        </div>
    `;
};


export const createOrderService = async (userId, addressId) => {
    const user = await User.findById(userId).populate('cart.part');
    if (!user || user.cart.length === 0) {
        throw new Error('Cart is empty or user not found');
    }

    const shippingAddress = user.addresses.id(addressId);
    if (!shippingAddress) {
        throw new Error('Invalid shipping address');
    }

    let totalAmount = 0;
    const orderItems = [];
    const itemsWithDetailsForEmail = [];

    for (const item of user.cart) {
        const part = item.part;
        if (!part) continue;

        if (part.stockQuantity < item.quantity) {
            throw new Error(`Not enough stock for ${part.name}`);
        }

        totalAmount += item.quantity * part.price;
        orderItems.push({
            part: part._id,
            quantity: item.quantity,
            price: part.price
        });
        itemsWithDetailsForEmail.push({
            name: part.name,
            sku: part.sku,
            quantity: item.quantity,
            price: part.price
        });
    }

    const newOrder = new Order({
        orderId: generateOrderId(),
        user: userId,
        items: orderItems,
        totalAmount,
        shippingAddress: shippingAddress.toObject(),
    });

    await newOrder.save();

    for (const item of user.cart) {
        await Part.findByIdAndUpdate(item.part._id, { $inc: { stockQuantity: -item.quantity } });
    }

    user.cart = [];
    await user.save();

    if (process.env.ADMIN_EMAIL) {
        const adminEmailHtml = formatEmailForAdmin(newOrder, user, itemsWithDetailsForEmail);
        try {
            await sendEmail({
                email: process.env.ADMIN_EMAIL,
                subject: `New Manual Order Received - #${newOrder.orderId}`,
                html: adminEmailHtml
            });
        } catch (emailError) {
            console.error("Failed to send order notification email to admin:", emailError);
        }
    } else {
        console.warn("ADMIN_EMAIL environment variable is not set. Skipping order notification email.");
    }
    
    return newOrder;
};

export const getMyOrdersService = async (userId) => {
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderByIdService = async (orderId, userId) => {
    const order = await Order.findOne({ _id: orderId, user: userId }).populate('items.part');
    if (!order) throw new Error('Order not found');
    return order;
};

export const getAllOrdersAdminService = async (filters) => {
    const { page = 1, limit = 10, status } = filters;
    const query = {};
    if (status) query.status = status;
    
    const orders = await Order.find(query)
        .populate('user', 'fullName email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(query);

    return {
        orders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: parseInt(page),
    };
};

export const updateOrderStatusAdminService = async (orderId, status) => {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) throw new Error('Order not found');
    return order;
};