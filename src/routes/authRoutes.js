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

