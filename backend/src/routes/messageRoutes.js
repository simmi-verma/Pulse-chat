const express = require('express');
const router = express.Router();
const { getMessages, postMessage, markRead } = require('../controllers/messageController');

// REST API endpoints requirement
router.get('/', getMessages);
router.post('/', postMessage);
router.put('/read', markRead);

module.exports = router;
