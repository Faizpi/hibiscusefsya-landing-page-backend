const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get services section settings
router.get('/section', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM services_section WHERE is_active = TRUE LIMIT 1');
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Get services section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update services section settings
router.put('/section', auth, isAdmin, async (req, res) => {
  try {
    const { section_label, title, title_highlight, description } = req.body;

    await pool.execute(`
      UPDATE services_section SET 
        section_label = ?, title = ?, title_highlight = ?, description = ?
      WHERE id = 1
    `, [section_label, title, title_highlight, description]);

    res.json({ message: 'Services section updated successfully' });
  } catch (error) {
    console.error('Update services section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all services
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM services ORDER BY display_order');
    res.json(rows);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get active services only (for public)
router.get('/active', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM services WHERE is_active = TRUE ORDER BY display_order');
    res.json(rows);
  } catch (error) {
    console.error('Get active services error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create service
router.post('/', auth, isAdmin, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, full_description, image, link, is_coming_soon, display_order, is_active } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO services (title, description, full_description, image, link, is_coming_soon, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, description, full_description, image, link, is_coming_soon || false, display_order || 0, is_active !== false]);

    res.status(201).json({ 
      message: 'Service created successfully',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update service
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, full_description, image, link, is_coming_soon, display_order, is_active } = req.body;

    await pool.execute(`
      UPDATE services SET 
        title = ?, description = ?, full_description = ?, image = ?, 
        link = ?, is_coming_soon = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `, [title, description, full_description, image, link, is_coming_soon, display_order, is_active, req.params.id]);

    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete service
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reorder services
router.put('/reorder', auth, isAdmin, async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, display_order }
    
    for (const item of orders) {
      await pool.execute('UPDATE services SET display_order = ? WHERE id = ?', [item.display_order, item.id]);
    }

    res.json({ message: 'Services reordered successfully' });
  } catch (error) {
    console.error('Reorder services error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
