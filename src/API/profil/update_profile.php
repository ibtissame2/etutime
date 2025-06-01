<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $data = getPostData();
    $db = openDatabase();
    $user = get_user_id($db, $data, true);
    
    if (empty($data['userData'])) {
        throw new Exception('Données utilisateur manquantes', 400);
    }

    $userData = $data['userData'];

    // Validation des données
    if (empty($userData['first_name']) || empty($userData['last_name']) || empty($userData['email'])) {
        throw new Exception('Les champs Prénom, Nom et Email sont obligatoires', 400);
    }

    if (!filter_var($userData['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Format d\'email invalide', 400);
    }

    // Mise à jour de la table users
    $sql = "UPDATE users SET 
            first_name = ?, 
            last_name = ?, 
            email = ?, 
            profile_photo_path = ?
            WHERE id = ?";
    
    $profilePhotoPath = $userData['profile_photo_path'] ?? null;
    executeSQL($db, $sql, [
        $userData['first_name'],
        $userData['last_name'],
        $userData['email'],
        $profilePhotoPath,
        $user['id']
    ]);

    // Mise à jour ou création du profil dans user_profiles
    $sql = "INSERT INTO user_profiles 
            (user_id, phone, location, bio, program, role) 
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            phone = VALUES(phone),
            location = VALUES(location),
            bio = VALUES(bio),
            program = VALUES(program),
            role = VALUES(role)";
    
    executeSQL($db, $sql, [
        $user['id'],
        $userData['phone'] ?? null,
        $userData['location'] ?? null,
        $userData['bio'] ?? null,
        $userData['program'] ?? null,
        $userData['role'] ?? 'Étudiant'
    ]);

    // Récupérer le profil mis à jour pour le retourner
    $sql = "SELECT 
                u.id, u.first_name, u.last_name, u.email, u.created_at, u.profile_photo_path,
                up.phone, up.location, up.bio, up.program, up.role
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE u.id = ?";
    
    $updatedProfile = executeSQL($db, $sql, [$user['id']], false);

    echo json_encode([
        'success' => true,
        'message' => 'Profil mis à jour avec succès',
        'profile' => $updatedProfile[0]
    ]);

} catch (Exception $e) {
    error_log("ERREUR update_profile.php: " . $e->getMessage());
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>