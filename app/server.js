import express from 'express';
import controllers from '../controllers/index.js';
import viteExpress from 'vite-express';
import session from 'express-session';

const app = express();
app.use(express.json());
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // 改成 true 如果你使用 HTTPS
        httpOnly: true,
        maxAge: 6000000 // 1 minute
    }
}));

// CORS 中间件 - 禁用 CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// 使用你的控制器
app.use('/api', controllers);

const server = app.listen(3251, () => {
    console.log('Server is running on port 3251');
});

viteExpress.bind(app, server);
