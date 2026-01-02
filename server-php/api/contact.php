<?php
/**
 * Contact Content API - PHP 7.4 Compatible
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
        $stmt = $pdo->query("SELECT * FROM contact_content WHERE id = 1");
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            // Parse JSON fields
            if (isset($data['contact_info']) && is_string($data['contact_info'])) {
                $data['contact_info'] = json_decode($data['contact_info'], true);
            }
            if (isset($data['social_links']) && is_string($data['social_links'])) {
                $data['social_links'] = json_decode($data['social_links'], true);
            }

            echo json_encode([
                'success' => true,
                'data' => $data
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'No contact content found'
            ]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
            exit();
        }

        $contactInfo = isset($input['contact_info']) ? json_encode($input['contact_info']) : '{}';
        $socialLinks = isset($input['social_links']) ? json_encode($input['social_links']) : '{}';

        $stmt = $pdo->prepare("
            INSERT INTO contact_content (id, section_title, section_subtitle, heading, description, contact_info, social_links, map_embed)
            VALUES (1, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            section_title = VALUES(section_title),
            section_subtitle = VALUES(section_subtitle),
            heading = VALUES(heading),
            description = VALUES(description),
            contact_info = VALUES(contact_info),
            social_links = VALUES(social_links),
            map_embed = VALUES(map_embed),
            updated_at = CURRENT_TIMESTAMP
        ");

        $stmt->execute([
            $input['section_title'] ?? '',
            $input['section_subtitle'] ?? '',
            $input['heading'] ?? '',
            $input['description'] ?? '',
            $contactInfo,
            $socialLinks,
            $input['map_embed'] ?? ''
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Contact content updated successfully'
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
