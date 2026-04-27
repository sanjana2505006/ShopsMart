const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = require('./prisma');

const SALT_ROUNDS = 10;

function createToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        },
        process.env.JWT_SECRET || 'smartshop-dev-secret',
        { expiresIn: '7d' }
    );
}

function sanitizeUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };
}

function isCollegeEmail(email) {
    return /^[^\s@]+@[^\s@]+\.edu$/i.test(email);
}

async function signup(req, res) {
    const { name, email, password, role = 'student' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, college email, and password are required.' });
    }

    if (!isCollegeEmail(email)) {
        return res.status(400).json({ message: 'Please use a valid college email address.' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (existingUser) {
        return res.status(409).json({ message: 'An account already exists for this email.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: {
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            role: role === 'admin' ? 'admin' : 'student',
        },
    });

    const token = createToken(user);
    return res.status(201).json({ token, user: sanitizeUser(user) });
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = createToken(user);
    return res.json({ token, user: sanitizeUser(user) });
}

async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'smartshop-dev-secret');
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });

        if (!user) {
            return res.status(401).json({ message: 'Session is no longer valid.' });
        }

        req.user = sanitizeUser(user);
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
}

function getCurrentUser(req, res) {
    return res.json({ user: req.user });
}

module.exports = {
    authenticate,
    getCurrentUser,
    login,
    signup,
};
