const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
require('dotenv').config();

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashed_password = await bcrypt.hash(password, 10);

    const secret = speakeasy.generateSecret({ name: `SecureAuth (${email})` });

    const user = await User.create({
      name,
      email,
      hashed_password,
      role: role || 'user',
      two_fa_secret: secret.base32
    });

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.json({
      message: 'User registered successfully. Scan the QR code with Google Authenticator.',
      qrCode: qrCodeUrl
    });

  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.hashed_password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({ message: 'Password correct. Please enter your 2FA code.', email });

  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// VERIFY 2FA
exports.verify2FA = async (req, res) => {
  try {
    const { email, token } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const verified = speakeasy.totp.verify({
      secret: user.two_fa_secret,
      encoding: 'base32',
      token: token,
      window: 1
    });

    if (!verified) return res.status(401).json({ message: 'Invalid 2FA code' });

    const jwtToken = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful!', token: jwtToken, role: user.role });

  } catch (err) {
    res.status(500).json({ message: '2FA verification failed', error: err.message });
  }
};