const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const requireRole = require('../middleware/role');
const routeController = require('../controllers/routeController');

router.get('/dashboard', verifyToken, routeController.dashboard);
router.get('/admin', verifyToken, requireRole('admin'), routeController.adminPage);
router.get('/manager', verifyToken, requireRole('manager'), routeController.managerPage);
router.get('/profile', verifyToken, requireRole('user'), routeController.profilePage);

module.exports = router;