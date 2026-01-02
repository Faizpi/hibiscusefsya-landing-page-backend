<?php
/**
 * Hero Content API - PHP 7.4 Compatible
 * GET: Retrieve hero content
 * POST: Update hero content (requires auth)
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
        // Get hero content
        $stmt = $pdo->query("SELECT * FROM hero_content WHERE id = 1");
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            // Parse JSON fields
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
                'message' => 'No hero content found'
            ]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Update hero content
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
            exit();
        }

        // Prepare stats as JSON
        $stats = isset($input['stats']) ? json_encode($input['stats']) : '[]';

        $stmt = $pdo->prepare("
            INSERT INTO hero_content (id, badge_text, title, subtitle, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, background_image, stats)
            VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            badge_text = VALUES(badge_text),
            title = VALUES(title),
            subtitle = VALUES(subtitle),
            description = VALUES(description),
            primary_button_text = VALUES(primary_button_text),
            primary_button_link = VALUES(primary_button_link),
            secondary_button_text = VALUES(secondary_button_text),
            secondary_button_link = VALUES(secondary_button_link),
            background_image = VALUES(background_image),
            stats = VALUES(stats),
            updated_at = CURRENT_TIMESTAMP
        ");

        $stmt->execute([
            $input['badge_text'] ?? '',
            $input['title'] ?? '',
            $input['subtitle'] ?? '',
            $input['description'] ?? '',
            $input['primary_button_text'] ?? '',
            $input['primary_button_link'] ?? '',
            $input['secondary_button_text'] ?? '',
            $input['secondary_button_link'] ?? '',
            $input['background_image'] ?? '',
            $stats
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Hero content updated successfully'
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
