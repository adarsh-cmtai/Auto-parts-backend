import { User } from '../models/user.model.js';
// import { Order } from '../models/order.model.js'; // <-- Aapko is line ko uncomment karke apne Order model ko import karna hoga

// Abhi ke liye, main ek dummy Order model bana raha hoon.
// Isse apne real Order model se replace karein.
import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
    createdAt: Date,
    totalAmount: Number,
    status: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
// Dummy Order model end.

export const getDashboardStatsService = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Todays Revenue
    const todayRevenueAgg = await Order.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const todayRevenue = todayRevenueAgg.length > 0 ? todayRevenueAgg[0].total : 0;

    // Yesterdays Revenue
    const yesterdayRevenueAgg = await Order.aggregate([
        { $match: { createdAt: { $gte: yesterday, $lt: today } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const yesterdayRevenue = yesterdayRevenueAgg.length > 0 ? yesterdayRevenueAgg[0].total : 0;

    // Today's Orders
    const todayOrdersCount = await Order.countDocuments({ createdAt: { $gte: today } });

    // Yesterday's Orders
    const yesterdayOrdersCount = await Order.countDocuments({ createdAt: { $gte: yesterday, $lt: today } });

    // New Customers Today
    const todayNewCustomers = await User.countDocuments({ createdAt: { $gte: today }, role: 'USER' });

    // New Customers Yesterday
    const yesterdayNewCustomers = await User.countDocuments({ createdAt: { $gte: yesterday, $lt: today }, role: 'USER' });
    
    // Revenue Change Percentage
    const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : (todayRevenue > 0 ? 100 : 0);

    // Orders Change Percentage
    const ordersChange = yesterdayOrdersCount > 0 ? ((todayOrdersCount - yesterdayOrdersCount) / yesterdayOrdersCount) * 100 : (todayOrdersCount > 0 ? 100 : 0);
    
    // Customers Change Percentage
    const customersChange = yesterdayNewCustomers > 0 ? ((todayNewCustomers - yesterdayNewCustomers) / yesterdayNewCustomers) * 100 : (todayNewCustomers > 0 ? 100 : 0);

    // Recent Orders
    const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'fullName');

    return {
        stats: {
            todayRevenue: { value: todayRevenue, change: revenueChange.toFixed(1) },
            todayOrders: { value: todayOrdersCount, change: ordersChange.toFixed(1) },
            newCustomers: { value: todayNewCustomers, change: customersChange.toFixed(1) },
        },
        recentOrders: recentOrders.map(order => ({
            id: order._id,
            customer: order.user ? order.user.fullName : 'Guest',
            date: order.createdAt.toLocaleDateString(),
            amount: order.totalAmount,
            status: order.status
        }))
    };
};