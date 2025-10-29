import * as dashboardService from '../../services/dashboard.service.js';

export const getDashboardStats = async (req, res) => {
    try {
        const stats = await dashboardService.getDashboardStatsService();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
    }
};