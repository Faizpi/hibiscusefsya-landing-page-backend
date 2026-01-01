<?php
require_once __DIR__ . '/config.php';

// Get request path
$requestUri = $_SERVER['REQUEST_URI'];
$basePath = '/admin/api';
$path = str_replace($basePath, '', parse_url($requestUri, PHP_URL_PATH));
$method = $_SERVER['REQUEST_METHOD'];

// Get JSON body
$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Router
switch ($path) {
    // Auth routes
    case '/auth/login':
        if ($method === 'POST') {
            handleLogin($input);
        }
        break;
        
    case '/auth/me':
        if ($method === 'GET') {
            handleGetMe();
        }
        break;
        
    case '/auth/logout':
        if ($method === 'POST') {
            jsonResponse(['message' => 'Logged out successfully']);
        }
        break;
    
    // Content routes
    case '/content/hero':
        handleHeroContent($method, $input);
        break;
        
    case '/content/about':
        handleAboutContent($method, $input);
        break;
        
    case '/content/contact':
        handleContactContent($method, $input);
        break;
    
    // Services routes
    case '/services':
        handleServices($method, $input);
        break;
        
    case '/services/section':
        handleServicesSection($method, $input);
        break;
    
    // Upload route
    case '/upload':
        if ($method === 'POST') {
            handleUpload();
        }
        break;
        
    // Settings route
    case '/settings':
        handleSettings($method, $input);
        break;
    
    default:
        // Check for service by ID
        if (preg_match('/\/services\/(\d+)/', $path, $matches)) {
            handleServiceById($method, $input, $matches[1]);
        } else {
            errorResponse('Endpoint not found', 404);
        }
}

// Auth handlers
function handleLogin($input) {
    if (empty($input['email']) || empty($input['password'])) {
        errorResponse('Email and password required');
    }
    
    $pdo = getDB();
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$input['email']]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($input['password'], $user['password'])) {
        errorResponse('Invalid email or password', 401);
    }
    
    $token = createJWT([
        'id' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role']
    ]);
    
    unset($user['password']);
    
    jsonResponse([
        'token' => $token,
        'user' => $user
    ]);
}

function handleGetMe() {
    $auth = getAuthUser();
    
    $pdo = getDB();
    $stmt = $pdo->prepare('SELECT id, username, email, full_name, role, avatar FROM users WHERE id = ?');
    $stmt->execute([$auth['id']]);
    $user = $stmt->fetch();
    
    if (!$user) {
        errorResponse('User not found', 404);
    }
    
    jsonResponse($user);
}

// Hero content handlers
function handleHeroContent($method, $input) {
    $pdo = getDB();
    
    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM hero_content WHERE id = 1');
        $data = $stmt->fetch();
        jsonResponse($data ?: []);
    }
    
    if ($method === 'PUT') {
        getAuthUser();
        
        $stmt = $pdo->prepare('
            INSERT INTO hero_content (id, badge_text, title, subtitle, description, primary_button_text, primary_button_link, 
                secondary_button_text, secondary_button_link, background_image, stats)
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
                updated_at = NOW()
        ');
        
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
            json_encode($input['stats'] ?? [])
        ]);
        
        jsonResponse(['message' => 'Hero content updated']);
    }
}

// About content handlers
function handleAboutContent($method, $input) {
    $pdo = getDB();
    
    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM about_content WHERE id = 1');
        $data = $stmt->fetch();
        if ($data) {
            $data['features'] = json_decode($data['features'], true);
            $data['stats'] = json_decode($data['stats'], true);
        }
        jsonResponse($data ?: []);
    }
    
    if ($method === 'PUT') {
        getAuthUser();
        
        $stmt = $pdo->prepare('
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
                updated_at = NOW()
        ');
        
        $stmt->execute([
            $input['section_title'] ?? '',
            $input['section_subtitle'] ?? '',
            $input['heading'] ?? '',
            $input['description'] ?? '',
            json_encode($input['features'] ?? []),
            json_encode($input['stats'] ?? []),
            $input['image'] ?? ''
        ]);
        
        jsonResponse(['message' => 'About content updated']);
    }
}

// Contact content handlers
function handleContactContent($method, $input) {
    $pdo = getDB();
    
    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM contact_content WHERE id = 1');
        $data = $stmt->fetch();
        if ($data) {
            $data['contact_info'] = json_decode($data['contact_info'], true);
            $data['social_links'] = json_decode($data['social_links'], true);
        }
        jsonResponse($data ?: []);
    }
    
    if ($method === 'PUT') {
        getAuthUser();
        
        $stmt = $pdo->prepare('
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
                updated_at = NOW()
        ');
        
        $stmt->execute([
            $input['section_title'] ?? '',
            $input['section_subtitle'] ?? '',
            $input['heading'] ?? '',
            $input['description'] ?? '',
            json_encode($input['contact_info'] ?? []),
            json_encode($input['social_links'] ?? []),
            $input['map_embed'] ?? ''
        ]);
        
        jsonResponse(['message' => 'Contact content updated']);
    }
}

// Services handlers
function handleServices($method, $input) {
    $pdo = getDB();
    
    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM services ORDER BY sort_order ASC');
        $data = $stmt->fetchAll();
        jsonResponse($data);
    }
    
    if ($method === 'POST') {
        getAuthUser();
        
        $stmt = $pdo->prepare('
            INSERT INTO services (name, description, icon, image, link, is_coming_soon, is_active, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ');
        
        $stmt->execute([
            $input['name'] ?? '',
            $input['description'] ?? '',
            $input['icon'] ?? '',
            $input['image'] ?? '',
            $input['link'] ?? '',
            $input['is_coming_soon'] ?? 0,
            $input['is_active'] ?? 1,
            $input['sort_order'] ?? 0
        ]);
        
        jsonResponse(['message' => 'Service created', 'id' => $pdo->lastInsertId()], 201);
    }
}

function handleServiceById($method, $input, $id) {
    $pdo = getDB();
    
    if ($method === 'GET') {
        $stmt = $pdo->prepare('SELECT * FROM services WHERE id = ?');
        $stmt->execute([$id]);
        $data = $stmt->fetch();
        if (!$data) {
            errorResponse('Service not found', 404);
        }
        jsonResponse($data);
    }
    
    if ($method === 'PUT') {
        getAuthUser();
        
        $stmt = $pdo->prepare('
            UPDATE services SET 
                name = ?, description = ?, icon = ?, image = ?, link = ?, 
                is_coming_soon = ?, is_active = ?, sort_order = ?, updated_at = NOW()
            WHERE id = ?
        ');
        
        $stmt->execute([
            $input['name'] ?? '',
            $input['description'] ?? '',
            $input['icon'] ?? '',
            $input['image'] ?? '',
            $input['link'] ?? '',
            $input['is_coming_soon'] ?? 0,
            $input['is_active'] ?? 1,
            $input['sort_order'] ?? 0,
            $id
        ]);
        
        jsonResponse(['message' => 'Service updated']);
    }
    
    if ($method === 'DELETE') {
        getAuthUser();
        
        $stmt = $pdo->prepare('DELETE FROM services WHERE id = ?');
        $stmt->execute([$id]);
        
        jsonResponse(['message' => 'Service deleted']);
    }
}

function handleServicesSection($method, $input) {
    $pdo = getDB();
    
    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM services_section WHERE id = 1');
        $data = $stmt->fetch();
        jsonResponse($data ?: []);
    }
    
    if ($method === 'PUT') {
        getAuthUser();
        
        $stmt = $pdo->prepare('
            INSERT INTO services_section (id, section_title, section_subtitle, heading, description)
            VALUES (1, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                section_title = VALUES(section_title),
                section_subtitle = VALUES(section_subtitle),
                heading = VALUES(heading),
                description = VALUES(description),
                updated_at = NOW()
        ');
        
        $stmt->execute([
            $input['section_title'] ?? '',
            $input['section_subtitle'] ?? '',
            $input['heading'] ?? '',
            $input['description'] ?? ''
        ]);
        
        jsonResponse(['message' => 'Services section updated']);
    }
}

// Upload handler
function handleUpload() {
    getAuthUser();
    
    if (!isset($_FILES['file'])) {
        errorResponse('No file uploaded');
    }
    
    $file = $_FILES['file'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!in_array($file['type'], $allowedTypes)) {
        errorResponse('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }
    
    $maxSize = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $maxSize) {
        errorResponse('File too large. Maximum size is 5MB.');
    }
    
    $uploadDir = __DIR__ . '/../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        errorResponse('Failed to upload file', 500);
    }
    
    $url = '/admin/uploads/' . $filename;
    
    jsonResponse([
        'message' => 'File uploaded successfully',
        'url' => $url,
        'filename' => $filename
    ]);
}

// Settings handler
function handleSettings($method, $input) {
    $pdo = getDB();
    
    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT setting_key, setting_value FROM site_settings');
        $rows = $stmt->fetchAll();
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        jsonResponse($settings);
    }
    
    if ($method === 'PUT') {
        getAuthUser();
        
        foreach ($input as $key => $value) {
            $stmt = $pdo->prepare('
                INSERT INTO site_settings (setting_key, setting_value)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
            ');
            $stmt->execute([$key, $value]);
        }
        
        jsonResponse(['message' => 'Settings updated']);
    }
}
