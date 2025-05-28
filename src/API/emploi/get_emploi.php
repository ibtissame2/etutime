<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['user']) || !$_SESSION['user']['logged_in']) {
    handleError('Utilisateur non connecté', 401);
}

$userId = $_SESSION['user']['id'];

try {
    $db = openDatabase();

    // Récupérer l'emploi du temps de l'utilisateur
    $sql = "SELECT emploi, horaire_fixe, niveau_concentration, created_at, updated_at 
            FROM emplois_du_temps 
            WHERE user_id = ?";
    $result = executeSQL($db, $sql, [$userId], false);

    if (count($result) > 0) {
        echo json_encode([
            'success' => true,
            'data' => [
                'emploi' => json_decode($result[0]['emploi']),
                'horaireFixe' => json_decode($result[0]['horaire_fixe']),
                'niveauConcentration' => $result[0]['niveau_concentration'],
                'createdAt' => $result[0]['created_at'],
                'updatedAt' => $result[0]['updated_at']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'data' => null,
            'message' => 'Aucun emploi du temps trouvé'
        ]);
    }

} catch (Exception $e) {
    handleError('Erreur lors de la récupération: ' . $e->getMessage());
}
?>