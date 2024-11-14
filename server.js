const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 7000;

connectDB();

// CORS configuration
// app.use(cors({
//     origin: 'http://localhost:3000', // Allow requests from your frontend
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
