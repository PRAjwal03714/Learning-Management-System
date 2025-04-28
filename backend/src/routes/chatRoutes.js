const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Get all messages in a course's group chat
router.get('/:courseId/messages', authMiddleware, chatController.getCourseMessages);

// Get messages from a private chat
router.get('/:courseId/messages/:userId', authMiddleware, chatController.getPrivateMessages);

// Send a message to course group chat
router.post('/:courseId/messages', authMiddleware, chatController.sendCourseMessage);

// Send a private message
router.post('/:courseId/messages/:userId', authMiddleware, chatController.sendPrivateMessage);

// Get all users in a course with their status
router.get('/:courseId/users', authMiddleware, chatController.getCourseUsers);

// Update user's online status
router.post('/status', authMiddleware, chatController.updateUserStatus);

// Mark messages as read
router.post('/messages/read', authMiddleware, chatController.markMessagesAsRead);

router.post('/typing', authMiddleware, chatController.updateTypingStatus);


module.exports = router; 