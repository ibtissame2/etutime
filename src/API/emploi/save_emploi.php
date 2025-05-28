<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

// Recevoir et décoder les données JSON
$data = getPostData();

if (empty($data)) {
    handleError('Aucune donnée reçue', 400);
}

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['user']) || !$_SESSION['user']['logged_in']) {
    handleError('Utilisateur non connecté', 401);
}

$userId = $_SESSION['user']['id'];
$emploi = $data['emploi'] ?? null;
$horaireFixe = $data['horaireFixe'] ?? null;

if (!$emploi) {
    handleError('Données d\'emploi du temps manquantes', 400);
}

try {
    $db = openDatabase();

    // Vérifier si un emploi du temps existe déjà pour cet utilisateur
    $sql = "SELECT id FROM emplois_du_temps WHERE user_id = ?";
    $result = executeSQL($db, $sql, [$userId], false);

    $emploiJson = json_encode($emploi);
    $horaireFixeJson = json_encode($horaireFixe);

    if (count($result) > 0) {
        // Mettre à jour l'emploi du temps existant
        $emploiId = $result[0]['id'];
        $sql = "UPDATE emplois_du_temps SET 
                emploi = ?, 
                horaire_fixe = ?,
                updated_at = NOW() 
                WHERE id = ?";
        executeSQL($db, $sql, [$emploiJson, $horaireFixeJson, $emploiId]);
    } else {
        // Créer un nouvel enregistrement
        $sql = "INSERT INTO emplois_du_temps (user_id, emploi, horaire_fixe, created_at, updated_at) 
                VALUES (?, ?, ?, NOW(), NOW())";
        executeSQL($db, $sql, [$userId, $emploiJson, $horaireFixeJson]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Emploi du temps enregistré avec succès'
    ]);

} catch (Exception $e) {
    handleError('Erreur lors de l\'enregistrement: ' . $e->getMessage());
}
?>