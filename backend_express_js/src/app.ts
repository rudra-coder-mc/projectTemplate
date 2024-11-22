import express from 'express';

import dotenv from 'dotenv';
import cors from 'cors';
import healthcheckRoute from './routes/healthcheck.routes.js';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/error.middleware.js';
import usetRoute from './routes/user.routes';
import adminRoute from './routes/admin.routes';
import passport from 'passport';
import session from 'express-session';
import './configs/passport.config';

const app = express();

dotenv.config({
  path: './.env',
});

// Middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN!,
    credentials: true,
  })
);

app.use('/api/v1/healthcheck', healthcheckRoute);

app.use('/api/v1/users', usetRoute);
app.use('/api/v1/admin', adminRoute);

app.use(errorHandler);

export { app };
