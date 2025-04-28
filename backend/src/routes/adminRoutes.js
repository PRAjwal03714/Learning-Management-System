// routes/adminRoutes.js (or .ts)
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/approve-instructor', adminController.approveInstructor);
router.get('/pending-instructors', adminController.getPendingInstructors);


module.exports = router;
