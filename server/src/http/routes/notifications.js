const express = require('express');
const router = express.Router();
const db = require('../../database/service');

// Get all notifications for a user
router.get('/', async (req, res) => {
  try {
    const { uuid, status } = req.query;

    if (!uuid) {
      return res.status(400).json({
        error: 'User UUID is required'
      });
    }

    const notifications = await db.getNotifications(uuid, status);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get pending notification count
router.get('/count', async (req, res) => {
  try {
    const { uuid } = req.query;

    if (!uuid) {
      return res.status(400).json({
        error: 'User UUID is required'
      });
    }

    const count = await db.getPendingNotificationCount(uuid);
    res.json({ count });
  } catch (error) {
    console.error('Error fetching notification count:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Update notification status
router.patch('/:notificationId', async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'accepted', 'declined'].includes(status)) {
      return res.status(400).json({
        error: 'Valid status is required'
      });
    }

    await db.updateNotificationStatus(notificationId, status);
    res.json({
      message: 'Notification status updated successfully'
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router; 