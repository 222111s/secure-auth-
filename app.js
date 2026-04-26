// Secure Authentication System - Main Entry Point
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database connected and synced');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ DB connection failed:', err));