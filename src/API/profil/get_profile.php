<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $data = $_GET; // Utilisation de $_GET pour les requêtes GET
    $db = openDatabase();
    $user = get_user_id($db, $data, true);

    // Requête pour récupérer les données de base de l'utilisateur
    $sql = "SELECT 
                u.id, u.first_name, u.last_name, u.email, u.created_at, 
                up.phone, up.location, up.bio, up.program, up.role
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE u.id = ?";

    $profile = executeSQL($db, $sql, [$user['id']], false);

    if (empty($profile)) {
        throw new Exception('Utilisateur non trouvé', 404);
    }

    echo json_encode([
        'success' => true,
        'profile' => $profile[0]
    ]);

} catch (Exception $e) {
    error_log("ERREUR get_profile.php: " . $e->getMessage());
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>