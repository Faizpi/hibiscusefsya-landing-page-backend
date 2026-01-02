<?php
/**
 * About Content API - PHP 7.4 Compatible
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

try {
    $pdo = getDB();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("SELECT * FROM about_content WHERE id = 1");
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            // Parse JSON fields
            if (isset($data['features']) && is_string($data['features'])) {
                $data['features'] = json_decode($data['features'], true);
            }
            if (isset($data['stats']) && is_string($data['stats'])) {
                $data['stats'] = json_decode($data['stats'], true);
            }

            echo json_encode([
                'success' => true,
                'data' => $data
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'No about content found'
            ]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
            exit();
        }

        $features = isset($input['features']) ? json_encode($input['features']) : '[]';
        $stats = isset($input['stats']) ? json_encode($input['stats']) : '[]';

        $stmt = $pdo->prepare("
            INSERT INTO about_content (id, section_title, section_subtitle, heading, description, features, stats, image)
            VALUES (1, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            section_title = VALUES(section_title),
            section_subtitle = VALUES(section_subtitle),
            heading = VALUES(heading),
            description = VALUES(description),
            features = VALUES(features),
            stats = VALUES(stats),
            image = VALUES(image),
            updated_at = CURRENT_TIMESTAMP
        ");

        $stmt->execute([
            $input['section_title'] ?? '',
            $input['section_subtitle'] ?? '',
            $input['heading'] ?? '',
            $input['description'] ?? '',
            $features,
            $stats,
            $input['image'] ?? ''
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'About content updated successfully'
        ]);
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
