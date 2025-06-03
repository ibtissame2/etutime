<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();

try {
    // Récupérer l'ID utilisateur depuis la session
    $user = get_user($db, true);
    $userId = $user['id'];

    // Récupérer les modules de l'utilisateur
    $sql = "SELECT id, name FROM modules WHERE user_id = ? ORDER BY name ASC";
    $result = executeSQL($db, $sql, [$userId], false);

    echo json_encode([
        'success' => true,
        'data' => $result
    ]);

} catch (Exception $e) {
    error_log('Erreur get_modules.php: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'data' => null,
        'message' => 'Erreur lors de la récupération des modules: ' . $e->getMessage()
    ]);
}
?>