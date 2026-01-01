require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  let connection;
  
  try {
    // Connect without database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Connected to database');

    // Create tables
    const createTables = `
      -- Users table for admin authentication
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor',
        avatar VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        last_login DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Site settings table
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type ENUM('text', 'image', 'json', 'boolean', 'number') DEFAULT 'text',
        category VARCHAR(50) DEFAULT 'general',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Hero section content
      CREATE TABLE IF NOT EXISTS hero_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        badge_text VARCHAR(255),
        title VARCHAR(255),
        title_highlight VARCHAR(100),
        description TEXT,
        button_primary_text VARCHAR(100),
        button_primary_link VARCHAR(255),
        button_secondary_text VARCHAR(100),
        button_secondary_link VARCHAR(255),
        hero_image VARCHAR(255),
        stat_1_value VARCHAR(20),
        stat_1_label VARCHAR(50),
        stat_2_value VARCHAR(20),
        stat_2_label VARCHAR(50),
        stat_3_value VARCHAR(20),
        stat_3_label VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- About section content
      CREATE TABLE IF NOT EXISTS about_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_label VARCHAR(100),
        title VARCHAR(255),
        title_highlight VARCHAR(100),
        description TEXT,
        feature_1_icon VARCHAR(50),
        feature_1_title VARCHAR(100),
        feature_1_description TEXT,
        feature_2_icon VARCHAR(50),
        feature_2_title VARCHAR(100),
        feature_2_description TEXT,
        feature_3_icon VARCHAR(50),
        feature_3_title VARCHAR(100),
        feature_3_description TEXT,
        feature_4_icon VARCHAR(50),
        feature_4_title VARCHAR(100),
        feature_4_description TEXT,
        card_stat_1_value VARCHAR(20),
        card_stat_1_label VARCHAR(50),
        card_stat_2_value VARCHAR(20),
        card_stat_2_label VARCHAR(50),
        card_stat_3_value VARCHAR(20),
        card_stat_3_label VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Services table
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        full_description TEXT,
        image VARCHAR(255),
        link VARCHAR(255),
        is_coming_soon BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Services section settings
      CREATE TABLE IF NOT EXISTS services_section (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_label VARCHAR(100),
        title VARCHAR(255),
        title_highlight VARCHAR(100),
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Contact section content
      CREATE TABLE IF NOT EXISTS contact_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_label VARCHAR(100),
        title VARCHAR(255),
        title_highlight VARCHAR(100),
        description TEXT,
        email VARCHAR(100),
        phone VARCHAR(50),
        address TEXT,
        whatsapp VARCHAR(50),
        instagram VARCHAR(100),
        linkedin VARCHAR(100),
        twitter VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Footer content
      CREATE TABLE IF NOT EXISTS footer_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(100),
        company_tagline TEXT,
        copyright_text VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Contact form submissions
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        is_replied BOOLEAN DEFAULT FALSE,
        replied_at DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Activity logs
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        description TEXT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );

      -- Media library
      CREATE TABLE IF NOT EXISTS media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255),
        mime_type VARCHAR(100),
        size INT,
        path VARCHAR(255) NOT NULL,
        uploaded_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
      );
    `;

    // Execute each CREATE TABLE statement
    const statements = createTables.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    console.log('✅ Tables created successfully');

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const insertAdmin = `
      INSERT IGNORE INTO users (username, email, password, full_name, role)
      VALUES ('admin', 'admin@hibiscusefsya.com', ?, 'Administrator', 'super_admin')
    `;
    await connection.execute(insertAdmin, [hashedPassword]);
    console.log('✅ Default admin user created (username: admin, password: admin123)');

    // Insert default hero content
    const insertHero = `
      INSERT IGNORE INTO hero_content (id, badge_text, title, title_highlight, description, 
        button_primary_text, button_secondary_text, stat_1_value, stat_1_label, 
        stat_2_value, stat_2_label, stat_3_value, stat_3_label)
      VALUES (1, '🌺 Peluang Kemitraan & Franchise', 'Raih Kesuksesan', 'Bersama Kami',
        'Hibiscus Efsya membuka kesempatan kemitraan franchise untuk Anda yang ingin memulai bisnis dengan sistem yang sudah teruji dan dukungan penuh dari tim profesional kami.',
        'Daftar Franchise', 'Pelajari Lebih Lanjut', '4+', 'Unit Bisnis', '50+', 'Mitra Aktif', '5+', 'Tahun Pengalaman')
    `;
    await connection.execute(insertHero);
    console.log('✅ Default hero content inserted');

    // Insert default about content
    const insertAbout = `
      INSERT IGNORE INTO about_content (id, section_label, title, title_highlight, description,
        feature_1_icon, feature_1_title, feature_1_description,
        feature_2_icon, feature_2_title, feature_2_description,
        feature_3_icon, feature_3_title, feature_3_description,
        feature_4_icon, feature_4_title, feature_4_description,
        card_stat_1_value, card_stat_1_label, card_stat_2_value, card_stat_2_label, card_stat_3_value, card_stat_3_label)
      VALUES (1, 'Tentang Kami', 'Mengapa Bermitra dengan', 'Hibiscus Efsya?',
        'Sebagai bagian dari M.B.K Indonesia, kami membuka kesempatan kemitraan franchise untuk berbagai unit bisnis kami. Bergabunglah dengan jaringan bisnis yang sudah teruji dan raih kesuksesan bersama kami.',
        '💡', 'Sistem Teruji', 'Model bisnis yang sudah terbukti sukses dan siap direplikasi',
        '🤝', 'Dukungan Penuh', 'Tim support yang siap membantu mitra dalam setiap tahap',
        '⚡', 'Proses Cepat', 'Pendaftaran dan setup bisnis yang efisien',
        '🛡️', 'Brand Terpercaya', 'Reputasi dan kualitas yang sudah diakui',
        '5+', 'Tahun', '4', 'Unit Bisnis', '50+', 'Mitra')
    `;
    await connection.execute(insertAbout);
    console.log('✅ Default about content inserted');

    // Insert default services section
    const insertServicesSection = `
      INSERT IGNORE INTO services_section (id, section_label, title, title_highlight, description)
      VALUES (1, 'Unit Bisnis', 'Peluang', 'Kemitraan Franchise', 'Bergabunglah dengan jaringan bisnis kami dan raih kesuksesan bersama Hibiscus Efsya')
    `;
    await connection.execute(insertServicesSection);
    console.log('✅ Default services section inserted');

    // Insert default services
    const insertServices = `
      INSERT IGNORE INTO services (id, title, description, full_description, link, is_coming_soon, display_order)
      VALUES 
        (1, 'Body Care', 'Perawatan tubuh profesional', 'Nikmati pengalaman perawatan tubuh yang menyegarkan dengan produk dan layanan berkualitas tinggi. Kami menawarkan berbagai treatment spa, massage therapy, dan skincare yang disesuaikan dengan kebutuhan kulit Anda untuk hasil yang maksimal.', 'https://bodycare.hibiscusefsya.com', FALSE, 1),
        (2, 'Travel', 'Paket wisata eksklusif', 'Jelajahi destinasi impian Anda bersama kami. Dari wisata domestik hingga internasional, kami menyediakan paket perjalanan yang terencana dengan baik, akomodasi premium, dan pengalaman tak terlupakan untuk liburan Anda.', NULL, TRUE, 2),
        (3, 'Fashion', 'Koleksi busana terkini', 'Tampil stylish dengan koleksi fashion terbaru kami. Dari casual hingga formal, kami menghadirkan busana berkualitas dengan desain modern yang sesuai dengan tren terkini dan gaya personal Anda.', NULL, TRUE, 3),
        (4, 'Akuntansi', 'Layanan pembukuan bisnis', 'Kelola keuangan bisnis Anda dengan lebih baik. Tim akuntan profesional kami siap membantu pembukuan, laporan keuangan, perpajakan, dan konsultasi finansial untuk mendukung pertumbuhan usaha Anda.', 'https://akuntansi.hibiscusefsya.com', FALSE, 4)
    `;
    await connection.execute(insertServices);
    console.log('✅ Default services inserted');

    // Insert default contact content
    const insertContact = `
      INSERT IGNORE INTO contact_content (id, section_label, title, title_highlight, description, email, phone, address)
      VALUES (1, 'Hubungi Kami', 'Tertarik', 'Bermitra?', 
        'Ceritakan minat Anda untuk bermitra dengan kami dan tim kami akan segera menghubungi untuk memberikan informasi lengkap tentang peluang franchise.',
        'admin@hibiscusefsya.com', '+62 812 3456 7890', 'Jakarta, Indonesia')
    `;
    await connection.execute(insertContact);
    console.log('✅ Default contact content inserted');

    // Insert default footer content
    const insertFooter = `
      INSERT IGNORE INTO footer_content (id, company_name, company_tagline, copyright_text)
      VALUES (1, 'Hibiscus Efsya', 'Bagian dari M.B.K Indonesia. Membuka peluang kemitraan franchise untuk kesuksesan bersama.', '© 2026 Hibiscus Efsya. All rights reserved.')
    `;
    await connection.execute(insertFooter);
    console.log('✅ Default footer content inserted');

    console.log('\n🌺 Database setup completed successfully!');
    console.log('📝 Default admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n⚠️  Please change the password after first login!\n');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
