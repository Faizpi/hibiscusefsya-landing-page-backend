<?php
/**
 * Authentication API - PHP 7.4 Compatible
 * Handles admin login and user authentication
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

    // Get request method and path
    $method = $_SERVER['REQUEST_METHOD'];
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    if (strpos($path, '/login') !== false && $method === 'POST') {
        // Login endpoint
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input || empty($input['email']) || empty($input['password'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Email dan password diperlukan'
            ]);
            exit();
        }

        $email = $input['email'];
        $password = $input['password'];

        // Find user by email
        $stmt = $pdo->prepare("SELECT id, username, email, password, full_name, role FROM users WHERE email = ? AND is_active = 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Email atau password salah'
            ]);
            exit();
        }

        // Generate simple token (in production, use JWT)
        $token = bin2hex(random_bytes(32));

        // Store token in session or database if needed
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['token'] = $token;

        // Remove password from response
        unset($user['password']);

        echo json_encode([
            'success' => true,
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => $user
        ]);
    } elseif (strpos($path, '/logout') !== false && $method === 'POST') {
        // Logout endpoint
        session_destroy();
        echo json_encode([
            'success' => true,
            'message' => 'Logout berhasil'
        ]);
    } elseif (strpos($path, '/me') !== false && $method === 'GET') {
        // Get current user
        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Unauthorized'
            ]);
            exit();
        }

        $stmt = $pdo->prepare("SELECT id, username, email, full_name, role, avatar FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ]);
            exit();
        }

        echo json_encode([
            'success' => true,
            'data' => $user
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint tidak ditemukan'
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
