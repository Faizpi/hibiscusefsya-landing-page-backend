const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get hero content
router.get('/hero', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM hero_content WHERE is_active = TRUE LIMIT 1');
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Get hero error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update hero content
router.put('/hero', auth, isAdmin, async (req, res) => {
  try {
    const {
      badge_text, title, title_highlight, description,
      button_primary_text, button_primary_link,
      button_secondary_text, button_secondary_link,
      hero_image, stat_1_value, stat_1_label,
      stat_2_value, stat_2_label, stat_3_value, stat_3_label
    } = req.body;

    await pool.execute(`
      UPDATE hero_content SET 
        badge_text = ?, title = ?, title_highlight = ?, description = ?,
        button_primary_text = ?, button_primary_link = ?,
        button_secondary_text = ?, button_secondary_link = ?,
        hero_image = ?, stat_1_value = ?, stat_1_label = ?,
        stat_2_value = ?, stat_2_label = ?, stat_3_value = ?, stat_3_label = ?
      WHERE id = 1
    `, [
      badge_text, title, title_highlight, description,
      button_primary_text, button_primary_link,
      button_secondary_text, button_secondary_link,
      hero_image, stat_1_value, stat_1_label,
      stat_2_value, stat_2_label, stat_3_value, stat_3_label
    ]);

    res.json({ message: 'Hero content updated successfully' });
  } catch (error) {
    console.error('Update hero error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get about content
router.get('/about', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM about_content WHERE is_active = TRUE LIMIT 1');
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Get about error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update about content
router.put('/about', auth, isAdmin, async (req, res) => {
  try {
    const data = req.body;

    await pool.execute(`
      UPDATE about_content SET 
        section_label = ?, title = ?, title_highlight = ?, description = ?,
        feature_1_icon = ?, feature_1_title = ?, feature_1_description = ?,
        feature_2_icon = ?, feature_2_title = ?, feature_2_description = ?,
        feature_3_icon = ?, feature_3_title = ?, feature_3_description = ?,
        feature_4_icon = ?, feature_4_title = ?, feature_4_description = ?,
        card_stat_1_value = ?, card_stat_1_label = ?,
        card_stat_2_value = ?, card_stat_2_label = ?,
        card_stat_3_value = ?, card_stat_3_label = ?
      WHERE id = 1
    `, [
      data.section_label, data.title, data.title_highlight, data.description,
      data.feature_1_icon, data.feature_1_title, data.feature_1_description,
      data.feature_2_icon, data.feature_2_title, data.feature_2_description,
      data.feature_3_icon, data.feature_3_title, data.feature_3_description,
      data.feature_4_icon, data.feature_4_title, data.feature_4_description,
      data.card_stat_1_value, data.card_stat_1_label,
      data.card_stat_2_value, data.card_stat_2_label,
      data.card_stat_3_value, data.card_stat_3_label
    ]);

    res.json({ message: 'About content updated successfully' });
  } catch (error) {
    console.error('Update about error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get contact content
router.get('/contact', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contact_content WHERE is_active = TRUE LIMIT 1');
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update contact content
router.put('/contact', auth, isAdmin, async (req, res) => {
  try {
    const data = req.body;

    await pool.execute(`
      UPDATE contact_content SET 
        section_label = ?, title = ?, title_highlight = ?, description = ?,
        email = ?, phone = ?, address = ?, whatsapp = ?,
        instagram = ?, linkedin = ?, twitter = ?
      WHERE id = 1
    `, [
      data.section_label, data.title, data.title_highlight, data.description,
      data.email, data.phone, data.address, data.whatsapp,
      data.instagram, data.linkedin, data.twitter
    ]);

    res.json({ message: 'Contact content updated successfully' });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get footer content
router.get('/footer', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM footer_content WHERE is_active = TRUE LIMIT 1');
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Get footer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update footer content
router.put('/footer', auth, isAdmin, async (req, res) => {
  try {
    const { company_name, company_tagline, copyright_text } = req.body;

    await pool.execute(`
      UPDATE footer_content SET 
        company_name = ?, company_tagline = ?, copyright_text = ?
      WHERE id = 1
    `, [company_name, company_tagline, copyright_text]);

    res.json({ message: 'Footer content updated successfully' });
  } catch (error) {
    console.error('Update footer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all content for frontend
router.get('/all', async (req, res) => {
  try {
    const [hero] = await pool.execute('SELECT * FROM hero_content WHERE is_active = TRUE LIMIT 1');
    const [about] = await pool.execute('SELECT * FROM about_content WHERE is_active = TRUE LIMIT 1');
    const [servicesSection] = await pool.execute('SELECT * FROM services_section WHERE is_active = TRUE LIMIT 1');
    const [services] = await pool.execute('SELECT * FROM services WHERE is_active = TRUE ORDER BY display_order');
    const [contact] = await pool.execute('SELECT * FROM contact_content WHERE is_active = TRUE LIMIT 1');
    const [footer] = await pool.execute('SELECT * FROM footer_content WHERE is_active = TRUE LIMIT 1');

    res.json({
      hero: hero[0] || null,
      about: about[0] || null,
      servicesSection: servicesSection[0] || null,
      services: services,
      contact: contact[0] || null,
      footer: footer[0] || null
    });
  } catch (error) {
    console.error('Get all content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
