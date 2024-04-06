'use strict';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { registerUser, errorHandler, verifyToken } from 'lib-common-service';

import { FINANCE_API } from './constants.js';

// Routes
import routes from './routes/index.js';

const app = express();

// Setting up Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: '64kb' // Maximum request body size.
}));

app.use(express.urlencoded({
    limit: '32kb',
    extended: false
}));

app.use(rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
})); // Limit to 100 requests per 10 minutes

app.use(cookieParser());

app.use(registerUser);

const tokenKey = process.env.ACCESS_TOKEN_KEY;
app.use(verifyToken(tokenKey));

// Category Routes
app.post(`${FINANCE_API}/register-category`, routes.categoryRoutes.registerNewCategory);
app.get(`${FINANCE_API}/get-all-category`, routes.categoryRoutes.getAllCategoryInfo);
app.get(`${FINANCE_API}/get-category-by-id/:id`, routes.categoryRoutes.getCategoryInfoById);
app.get(`${FINANCE_API}/get-category-by-type/:type`, routes.categoryRoutes.getCategoryByType);
app.put(`${FINANCE_API}/update-category/:id`, routes.categoryRoutes.updateCategoryInfo);
app.delete(`${FINANCE_API}/delete-category/:id`, routes.categoryRoutes.deleteCategory);

// Finance Routes
app.post(`${FINANCE_API}/register-income`, routes.financeRoutes.registerIncome);
app.post(`${FINANCE_API}/register-investment`, routes.financeRoutes.registerInvestment);

app.use(errorHandler);

export default app;
