<?php
/**
 * Database Setup Script - PHP 7.4 Compatible
 * Run this once to create all required tables
 */

require_once __DIR__ . '/config.php';

try {
    $pdo = getDB();
    
    echo "Creating database tables...\n";
    
    // Users table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            full_name VARCHAR(100),
            role ENUM('admin', 'editor') DEFAULT 'editor',
            avatar VARCHAR(255),
            is_active TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✓ Users table created\n";
    
    // Site settings table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS site_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            setting_key VARCHAR(100) NOT NULL UNIQUE,
            setting_value TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✓ Site settings table created\n";
    
    // Hero content table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS hero_content (
            id INT PRIMARY KEY DEFAULT 1,
            badge_text VARCHAR(255),
            title VARCHAR(255),
            subtitle VARCHAR(255),
            description TEXT,
            primary_button_text VARCHAR(100),
            primary_button_link VARCHAR(255),
            secondary_button_text VARCHAR(100),
            secondary_button_link VARCHAR(255),
            background_image VARCHAR(255),
            stats JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✓ Hero content table created\n";
    
    // About content table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS about_content (
            id INT PRIMARY KEY DEFAULT 1,
            section_title VARCHAR(100),
            section_subtitle VARCHAR(255),
            heading VARCHAR(255),
            description TEXT,
            features JSON,
            stats JSON,
            image VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✓ About content table created\n";
    
    // Services table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS services (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            icon VARCHAR(50),
            image VARCHAR(255),
            link VARCHAR(255),
            is_coming_soon TINYINT(1) DEFAULT 0,
            is_active TINYINT(1) DEFAULT 1,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✓ Services table created\n";
    
    // Services section table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS services_section (
            id INT PRIMARY KEY DEFAULT 1,
            section_title VARCHAR(100),
            section_subtitle VARCHAR(255),
            heading VARCHAR(255),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✓ Services section table created\n";
    
    // Contact content table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS contact_content (
            id INT PRIMARY KEY DEFAULT 1,
            section_title VARCHAR(100),
            section_subtitle VARCHAR(255),
            heading VARCHAR(255),
            description TEXT,
            contact_info JSON,
            social_links JSON,
            map_embed TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✓ Contact content table created\n";
    
    // Footer content table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS footer_content (
            id INT PRIMARY KEY DEFAULT 1,
            company_name VARCHAR(100),
            tagline VARCHAR(255),
            description TEXT,
            copyright_text VARCHAR(255),
            links JSON,
            social_links JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✓ Footer content table created\n";
    
    // Contact submissions table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS contact_submissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            subject VARCHAR(200),
            message TEXT NOT NULL,
            is_read TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✓ Contact submissions table created\n";
    
    // Activity logs table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS activity_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            action VARCHAR(100) NOT NULL,
            description TEXT,
            ip_address VARCHAR(45),
            user_agent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✓ Activity logs table created\n";
    
    // Media table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS media (
            id INT AUTO_INCREMENT PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            original_name VARCHAR(255),
            file_path VARCHAR(255) NOT NULL,
            file_type VARCHAR(50),
            file_size INT,
            uploaded_by INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✓ Media table created\n";
    
    // Create default admin user
    $adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("
        INSERT IGNORE INTO users (username, email, password, full_name, role) 
        VALUES ('admin', 'admin@hibiscusefsya.com', ?, 'Administrator', 'admin')
    ");
    $stmt->execute([$adminPassword]);
    echo "✓ Default admin user created (email: admin@hibiscusefsya.com, password: admin123)\n";
    
    // Insert default hero content
    $pdo->exec("
        INSERT IGNORE INTO hero_content (id, badge_text, title, subtitle, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, stats) 
        VALUES (1, '🌺 Peluang Kemitraan & Franchise', 'Raih Kesuksesan Bersama Kami', 'Bisnis Terpercaya', 'Bergabunglah dengan jaringan franchise Hibiscus Efsya. Kami menyediakan sistem bisnis teruji, dukungan penuh, dan potensi keuntungan yang menjanjikan.', 'Daftar Franchise', '#contact', 'Pelajari Lebih Lanjut', '#services', '[{\"value\": \"4+\", \"label\": \"Unit Bisnis\"}, {\"value\": \"50+\", \"label\": \"Mitra Aktif\"}]')
    ");
    echo "✓ Default hero content inserted\n";
    
    // Insert default about content
    $pdo->exec("
        INSERT IGNORE INTO about_content (id, section_title, section_subtitle, heading, description, features, stats) 
        VALUES (1, 'Tentang Kami', 'Kenali Lebih Dekat', 'Hibiscus Efsya', 'Kami adalah perusahaan yang bergerak di berbagai bidang usaha dengan fokus pada pengembangan kemitraan dan franchise yang menguntungkan.', '[{\"icon\": \"Shield\", \"title\": \"Sistem Teruji\", \"description\": \"Sistem bisnis yang sudah terbukti berhasil\"}, {\"icon\": \"Users\", \"title\": \"Dukungan Penuh\", \"description\": \"Tim support yang siap membantu 24/7\"}, {\"icon\": \"Zap\", \"title\": \"Proses Cepat\", \"description\": \"Proses pendaftaran dan setup yang cepat\"}, {\"icon\": \"Award\", \"title\": \"Brand Terpercaya\", \"description\": \"Brand yang sudah dikenal dan dipercaya\"}]', '[{\"value\": \"4+\", \"label\": \"Unit Bisnis\"}, {\"value\": \"50+\", \"label\": \"Mitra Aktif\"}, {\"value\": \"98%\", \"label\": \"Kepuasan Mitra\"}]')
    ");
    echo "✓ Default about content inserted\n";
    
    // Insert default services
    $services = [
        ['Body Care', 'Produk perawatan tubuh berkualitas tinggi dengan bahan-bahan alami pilihan.', 'Sparkles', '', 'https://bodycare.hibiscusefsya.com', 0, 1, 1],
        ['Akuntansi', 'Layanan akuntansi profesional untuk membantu pengelolaan keuangan bisnis Anda.', 'Calculator', '', 'https://akuntansi.hibiscusefsya.com', 0, 1, 2],
        ['Fashion', 'Koleksi fashion terkini dengan desain modern dan kualitas premium.', 'Shirt', '', '', 1, 1, 3],
        ['Travel', 'Layanan perjalanan wisata dengan destinasi menarik dan harga terjangkau.', 'Plane', '', '', 1, 1, 4]
    ];
    
    $stmt = $pdo->prepare("
        INSERT IGNORE INTO services (name, description, icon, image, link, is_coming_soon, is_active, sort_order) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    foreach ($services as $service) {
        $stmt->execute($service);
    }
    echo "✓ Default services inserted\n";
    
    // Insert default services section
    $pdo->exec("
        INSERT IGNORE INTO services_section (id, section_title, section_subtitle, heading, description) 
        VALUES (1, 'Layanan Kami', 'Unit Bisnis', 'Peluang Kemitraan yang Tersedia', 'Pilih unit bisnis yang sesuai dengan minat dan modal Anda. Setiap unit bisnis dilengkapi dengan sistem operasional yang teruji.')
    ");
    echo "✓ Default services section inserted\n";
    
    // Insert default contact content
    $pdo->exec("
        INSERT IGNORE INTO contact_content (id, section_title, section_subtitle, heading, description, contact_info, social_links) 
        VALUES (1, 'Hubungi Kami', 'Tertarik Bermitra?', 'Mari Diskusi', 'Hubungi kami untuk informasi lebih lanjut tentang peluang kemitraan dan franchise.', '{\"email\": \"info@hibiscusefsya.com\", \"phone\": \"+62 812 3456 7890\", \"address\": \"Jl. Contoh No. 123, Jakarta\"}', '{\"instagram\": \"https://instagram.com/hibiscusefsya\", \"facebook\": \"https://facebook.com/hibiscusefsya\", \"whatsapp\": \"https://wa.me/6281234567890\"}')
    ");
    echo "✓ Default contact content inserted\n";
    
    echo "\n✅ Database setup completed successfully!\n";
    echo "\n📝 Admin Login:\n";
    echo "   Email: admin@hibiscusefsya.com\n";
    echo "   Password: admin123\n";
    echo "\n⚠️  Please change the admin password after first login!\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
