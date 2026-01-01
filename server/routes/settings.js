const express = require('express');
const pool = require('../config/database');
const { auth, isAdmin, isSuperAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all settings
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM site_settings ORDER BY category, setting_key');
    res.json(rows);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get settings by category
router.get('/category/:category', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM site_settings WHERE category = ? ORDER BY setting_key',
      [req.params.category]
    );
    res.json(rows);
  } catch (error) {
    console.error('Get settings by category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single setting
router.get('/:key', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM site_settings WHERE setting_key = ?',
      [req.params.key]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update or create setting
router.put('/:key', auth, isAdmin, async (req, res) => {
  try {
    const { setting_value, setting_type, category } = req.body;
    const setting_key = req.params.key;

    await pool.execute(`
      INSERT INTO site_settings (setting_key, setting_value, setting_type, category)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        setting_value = VALUES(setting_value),
        setting_type = VALUES(setting_type),
        category = VALUES(category)
    `, [setting_key, setting_value, setting_type || 'text', category || 'general']);

    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bulk update settings
router.put('/', auth, isAdmin, async (req, res) => {
  try {
    const { settings } = req.body; // Array of { key, value, type, category }

    for (const setting of settings) {
      await pool.execute(`
        INSERT INTO site_settings (setting_key, setting_value, setting_type, category)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          setting_value = VALUES(setting_value)
      `, [setting.key, setting.value, setting.type || 'text', setting.category || 'general']);
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Bulk update settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete setting
router.delete('/:key', auth, isSuperAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM site_settings WHERE setting_key = ?', [req.params.key]);
    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get activity logs
router.get('/logs/activity', auth, isAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const [rows] = await pool.execute(`
      SELECT al.*, u.username, u.full_name 
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [total] = await pool.execute('SELECT COUNT(*) as count FROM activity_logs');

    res.json({
      logs: rows,
      total: total[0].count
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get contact submissions
router.get('/submissions/contact', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const [rows] = await pool.execute(`
      SELECT * FROM contact_submissions
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [total] = await pool.execute('SELECT COUNT(*) as count FROM contact_submissions');
    const [unread] = await pool.execute('SELECT COUNT(*) as count FROM contact_submissions WHERE is_read = FALSE');

    res.json({
      submissions: rows,
      total: total[0].count,
      unread: unread[0].count
    });
  } catch (error) {
    console.error('Get contact submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark submission as read
router.put('/submissions/contact/:id/read', auth, async (req, res) => {
  try {
    await pool.execute('UPDATE contact_submissions SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Dashboard stats
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    const [totalServices] = await pool.execute('SELECT COUNT(*) as count FROM services WHERE is_active = TRUE');
    const [totalSubmissions] = await pool.execute('SELECT COUNT(*) as count FROM contact_submissions');
    const [unreadSubmissions] = await pool.execute('SELECT COUNT(*) as count FROM contact_submissions WHERE is_read = FALSE');
    const [recentLogs] = await pool.execute(`
      SELECT al.*, u.username 
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 5
    `);

    res.json({
      totalServices: totalServices[0].count,
      totalSubmissions: totalSubmissions[0].count,
      unreadSubmissions: unreadSubmissions[0].count,
      recentActivity: recentLogs
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
