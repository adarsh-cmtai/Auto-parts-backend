import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './api/auth.routes.js';
import userProfileRouter from './api/user/profile.routes.js';
import adminProfileRouter from './api/admin/profile.routes.js';
import userCartRouter from './api/user/cart.routes.js';
import adminCustomerRouter from './api/admin/customer.routes.js';
import adminBlogRouter from './api/admin/blog.routes.js';
import adminProductRouter from './api/admin/product.routes.js';
import adminNewsRouter from './api/admin/news.routes.js';
import publicProductRouter from './api/public.routes.js';
import orderRouter from './api/order.routes.js';
import adminDashboardRouter from './api/admin/dashboard.routes.js';
import enquiryRouter from './api/enquiry.routes.js';
import heroRouter from './api/hero.routes.js';
import reviewRouter from './api/review.routes.js';
import zohoRouter from './api/zoho.routes.js';
import { triggerFilterCacheRefresh } from './services/product.service.js';
import categorySlideRouter from './api/categorySlide.routes.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "https://auto-parts-frontend-sand.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    credentials: true,
  })
);


app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to OwnSilent API" });
});


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userProfileRouter);
app.use('/api/v1/user', userCartRouter);
app.use('/api/v1/admin', adminProfileRouter);
app.use('/api/v1/admin/customers', adminCustomerRouter);
app.use('/api/v1/admin/blog', adminBlogRouter);
app.use('/api/v1/admin/news', adminNewsRouter);
app.use('/api/v1/admin/products', adminProductRouter);
app.use('/api/v1/admin/dashboard', adminDashboardRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1', publicProductRouter);
app.use('/api/v1/enquiries', enquiryRouter);
app.use('/api/v1/hero-slides', heroRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/zoho', zohoRouter);
app.use('/api/v1/category-slides', categorySlideRouter);


const startServer = async () => {
    try {
        await connectDB();
        
        const port = process.env.PORT || 8000;

        app.listen(port, () => {
            console.log(`🚀 Server is running at http://localhost:${port}`);
            setTimeout(() => {
                triggerFilterCacheRefresh();
            }, 1000);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();