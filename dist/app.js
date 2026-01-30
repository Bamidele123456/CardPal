"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./config/db");
const auth_controller_1 = require("./controllers/auth.controller");
const auth_middleware_1 = require("./middleware/auth.middleware");
const product_controller_1 = require("./controllers/product.controller");
dotenv_1.default.config();
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Auth Routes
app.post('/api/auth/signup', auth_controller_1.signUp);
app.post('/api/auth/login', auth_controller_1.login);
app.post('/api/auth/logout', auth_controller_1.logout);
// Product Routes
app.post('/api/products', auth_middleware_1.protect, product_controller_1.createProduct);
app.get('/api/products', auth_middleware_1.protect, product_controller_1.getProducts);
app.get('/api/products/:id', auth_middleware_1.protect, product_controller_1.getProductById);
app.put('/api/products/:id', auth_middleware_1.protect, product_controller_1.updateProduct);
app.delete('/api/products/batchdelete', auth_middleware_1.protect, product_controller_1.deleteBatchProducts);
app.delete('/api/products/:id', auth_middleware_1.protect, product_controller_1.deleteProduct);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
