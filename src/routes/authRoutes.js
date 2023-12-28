const express = require('express');
const router = express.Router();
const zod = require('zod');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const registerSchema = zod.object({
    username: zod.string().min(3),
    email: zod.string().email(),
    password: zod.string().min(6),
});

const loginSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
});


router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = registerSchema.parse(req.body);

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ error: 'User exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        })

        await newUser.save();

        res.status(201).json({
            message: 'User regisatered Successfully'
        });

    } catch (error) {
        console(error);
        res.status(400).json({
            message: 'Invalid input'
        });
    }
});