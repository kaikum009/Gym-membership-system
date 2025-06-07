// require("dotenv").config();

// const { Pool } = require('pg'); // Correct import
// const express = require('express');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// import path from 'path';


// const pool = new Pool({  // Correct object instantiation
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME
// });

// app.use(cors({
//     origin: `http://localhost:${process.env.PORT}`
//   }));


// pool.connect()
//     .then(() => console.log("Connected to PostgreSQL"))
//     .catch(err => {
//         console.error("Connection error:", err);
//         process.exit(1); // 👈 ensures process stops with error code
//     });

//     const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// //index routes

// // Serve static files from the "public" directory
// // app.use(express.static(path.join(__dirname, 'public')));
// app.use('/public', express.static(path.join(__dirname, 'public')));

// // Optional: default route (in case you want to send index.html)
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import bodyParser from "body-parser"; 
import pool from './db.js'; 


import membersRouter from "./routes/members.js";
import paymentRouter from "./routes/payments.js";

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
      
 
app.use("/api/members", membersRouter);
app.use("/api/payment", paymentRouter);

// Serve frontend (if needed)
app.use('/public', express.static(path.join(__dirname, '../public')));

// Direct routes
app.get("/members", (req, res) => {

  res.sendFile(path.join(__dirname, "../public", "members.html"));
});

app.get("/payments", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "payment.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "das.html"));
});
const PORT = process.env.PORT || 4000;
console.log("Server booted");
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// login authentication

// const password = 'password123';
// bcrypt.hash(password, 10).then(console.log);
const plainPassword = 'shady12';
const hashedPassword = await bcrypt.hash(plainPassword, 10);  // Hash the password

console.log("Hashed Password: ", hashedPassword);  // Store this in your database
bcrypt.hash('shady12', 10).then(console.log);
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

        const token = jwt.sign({ username: user.username }, 'your-secret-key', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

