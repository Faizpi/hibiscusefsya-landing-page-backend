<?php
/**
 * Add service_categories table and update services table
 */

header('Content-Type: text/plain');

require_once __DIR__ . '/config.php';

try {
    $pdo = getDB();

    echo "Creating service_categories table...\n";

    // Service categories table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS service_categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            icon VARCHAR(50),
            color VARCHAR(50),
            bg_color VARCHAR(50),
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✓ Service categories table created\n";

    // Check if category_id column exists in services
    $stmt = $pdo->query("SHOW COLUMNS FROM services LIKE 'category_id'");
    if ($stmt->rowCount() == 0) {
        echo "Adding category_id column to services table...\n";
        $pdo->exec("ALTER TABLE services ADD COLUMN category_id INT AFTER id");
        echo "✓ category_id column added\n";
    } else {
        echo "✓ category_id column already exists\n";
    }

    // Insert default categories
    $categories = [
        ['Body Care', 'Sparkles', 'text-pink-600', 'bg-pink-100', 0],
        ['Fashion', 'Shirt', 'text-purple-600', 'bg-purple-100', 1],
        ['Travel', 'Plane', 'text-blue-600', 'bg-blue-100', 2],
        ['Technology', 'Calculator', 'text-green-600', 'bg-green-100', 3],
    ];

    $stmt = $pdo->prepare("
        INSERT IGNORE INTO service_categories (id, title, icon, color, bg_color, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    foreach ($categories as $index => $cat) {
        $stmt->execute([$index + 1, $cat[0], $cat[1], $cat[2], $cat[3], $cat[4]]);
    }
    echo "✓ Default categories inserted\n";

    // Insert default services
    $services = [
        [1, 'MBK Body Care', 'Rangkaian produk perawatan tubuh: Bedak Biang Keringat, Body Lotion, Body Mist, Deodorant Roll On, dan P.O. Powder', '', 'https://bodycare.hibiscusefsya.com', 0],
        [1, 'Spa Products', 'Produk spa berkualitas untuk relaksasi dan perawatan tubuh', '', '', 1],
        [1, 'Aromatherapy', 'Essential oil dan produk aromaterapi untuk kesehatan', '', '', 1],
        [1, 'Natural Skincare', 'Perawatan kulit dengan bahan-bahan alami pilihan', '', '', 1],
        [2, 'Casual Wear', 'Koleksi pakaian kasual untuk aktivitas sehari-hari', '', '', 1],
        [2, 'Modest Fashion', 'Fashion muslimah modern dan stylish', '', '', 1],
        [2, 'Accessories', 'Aksesoris fashion untuk melengkapi penampilan', '', '', 1],
        [2, 'Bags Collection', 'Koleksi tas untuk berbagai kesempatan', '', '', 1],
        [3, 'Domestic Tour', 'Paket wisata domestik ke destinasi terbaik Indonesia', '', '', 1],
        [3, 'International Tour', 'Paket wisata internasional dengan harga kompetitif', '', '', 1],
        [3, 'Umrah Package', 'Paket ibadah umrah dengan pelayanan terbaik', '', '', 1],
        [3, 'Corporate Travel', 'Solusi perjalanan bisnis untuk perusahaan', '', '', 1],
        [4, 'Jasa Akuntansi', 'Layanan akuntansi profesional untuk bisnis Anda', '', 'https://akuntansi.hibiscusefsya.com', 0],
        [4, 'Web Development', 'Pembuatan website profesional untuk bisnis', '', '', 1],
        [4, 'Digital Marketing', 'Strategi pemasaran digital untuk meningkatkan penjualan', '', '', 1],
        [4, 'IT Consulting', 'Konsultasi IT untuk transformasi digital bisnis', '', '', 1],
    ];

    // Clear existing services first
    $pdo->exec("DELETE FROM services WHERE category_id IS NOT NULL");

    $stmt = $pdo->prepare("
        INSERT INTO services (category_id, name, description, image, link, is_coming_soon, is_active, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    ");

    $order = 0;
    foreach ($services as $svc) {
        $stmt->execute([$svc[0], $svc[1], $svc[2], $svc[3], $svc[4], $svc[5], $order]);
        $order++;
    }
    echo "✓ Default services inserted\n";

    echo "\n✅ Migration completed successfully!\n";

} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
