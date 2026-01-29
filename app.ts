import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import { signUp, login, logout } from './controllers/auth.controller';
import { protect } from './middleware/auth.middleware';
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  deleteBatchProducts
} from './controllers/product.controller';


dotenv.config();
connectDB();

const app = express();

app.set('trust proxy', 1);


app.use(express.json());
app.use(cookieParser());

// Auth Routes
app.post('/api/auth/signup', signUp);
app.post('/api/auth/login', login);
app.post('/api/auth/logout', logout);
// Product Routes
app.post('/api/products', protect, createProduct);
app.get('/api/products', protect, getProducts);
app.get('/api/products/:id', protect, getProductById);
app.put('/api/products/:id', protect, updateProduct);
app.delete('/api/products/batchdelete', protect, deleteBatchProducts);
app.delete('/api/products/:id', protect, deleteProduct);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));