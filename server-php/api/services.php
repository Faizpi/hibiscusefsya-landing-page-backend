<?php
/**
 * Services API - PHP 7.4 Compatible
 * Handles categories and services CRUD
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

try {
    $pdo = getDB();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get all categories with their services
        $stmt = $pdo->query("SELECT * FROM service_categories ORDER BY sort_order ASC");
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($categories as &$category) {
            $stmt = $pdo->prepare("SELECT * FROM services WHERE category_id = ? AND is_active = 1 ORDER BY sort_order ASC");
            $stmt->execute([$category['id']]);
            $category['services'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Convert boolean fields
            foreach ($category['services'] as &$service) {
                $service['is_coming_soon'] = (bool) $service['is_coming_soon'];
                $service['is_active'] = (bool) $service['is_active'];
            }
        }

        echo json_encode([
            'success' => true,
            'data' => $categories
        ]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
            exit();
        }

        $action = $input['action'] ?? 'update_all';

        if ($action === 'update_all') {
            // Full update of all categories and services
            $categories = $input['categories'] ?? [];

            // Start transaction
            $pdo->beginTransaction();

            try {
                // Clear existing data
                $pdo->exec("DELETE FROM services");
                $pdo->exec("DELETE FROM service_categories");

                foreach ($categories as $catIndex => $category) {
                    // Insert category
                    $stmt = $pdo->prepare("
                        INSERT INTO service_categories (id, title, icon, color, bg_color, sort_order)
                        VALUES (?, ?, ?, ?, ?, ?)
                    ");
                    $catId = $category['id'] ?? ($catIndex + 1);
                    $stmt->execute([
                        $catId,
                        $category['title'] ?? '',
                        $category['icon'] ?? '',
                        $category['color'] ?? '',
                        $category['bg_color'] ?? '',
                        $catIndex
                    ]);

                    // Insert services for this category
                    if (isset($category['services']) && is_array($category['services'])) {
                        foreach ($category['services'] as $svcIndex => $service) {
                            $stmt = $pdo->prepare("
                                INSERT INTO services (category_id, name, description, image, link, is_coming_soon, is_active, sort_order)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                            ");
                            $stmt->execute([
                                $catId,
                                $service['name'] ?? '',
                                $service['description'] ?? '',
                                $service['image'] ?? '',
                                $service['link'] ?? '',
                                $service['is_coming_soon'] ?? 0,
                                $service['is_active'] ?? 1,
                                $svcIndex
                            ]);
                        }
                    }
                }

                $pdo->commit();
                echo json_encode([
                    'success' => true,
                    'message' => 'Services updated successfully'
                ]);
            } catch (Exception $e) {
                $pdo->rollBack();
                throw $e;
            }
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Unknown action']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
