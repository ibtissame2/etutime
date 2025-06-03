<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();

if (empty($data)) {
    handleError('Aucune donnée reçue', 400);
}

try {
    // Récupérer l'ID utilisateur depuis la session
    $user = get_user($db, true);
    $userId = $user['id'];

    $emploi = $data['emploi'] ?? null;
    $horaireFixe = $data['horaireFixe'] ?? null;
    $moduleId = $data['moduleId'] ?? null;

    if (!$emploi) {
        handleError('Données d\'emploi du temps manquantes', 400);
    }

    // Récupérer le dernier questionnaire_id de l'utilisateur
    $sqlQuestionnaire = "SELECT id FROM questionnaire_resultats WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
    $questionnaireResult = executeSQL($db, $sqlQuestionnaire, [$userId], false);

    if (count($questionnaireResult) === 0) {
        handleError('Aucun résultat de questionnaire trouvé. Veuillez d\'abord passer le questionnaire de niveau.', 400);
    }

    $questionnaireId = $questionnaireResult[0]['id'];
    $emploiJson = json_encode($emploi);
    $horaireFixeJson = json_encode($horaireFixe);

    // Vérifier si un emploi du temps existe déjà pour cet utilisateur
    $sql = "SELECT id FROM emplois_du_temps WHERE user_id = ?";
    $result = executeSQL($db, $sql, [$userId], false);

    if (count($result) > 0) {
        // Mettre à jour l'emploi du temps existant
        $emploiId = $result[0]['id'];
        $sql = "UPDATE emplois_du_temps SET 
                emploi = ?, 
                horaire_fixe = ?,
                module_id = ?,
                questionnaire_id = ?,
                updated_at = NOW() 
                WHERE id = ?";
        executeSQL($db, $sql, [$emploiJson, $horaireFixeJson, $moduleId, $questionnaireId, $emploiId]);
    } else {
        // Créer un nouvel enregistrement
        $sql = "INSERT INTO emplois_du_temps (user_id, module_id, questionnaire_id, emploi, horaire_fixe, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, NOW(), NOW())";
        executeSQL($db, $sql, [$userId, $moduleId, $questionnaireId, $emploiJson, $horaireFixeJson]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Emploi du temps enregistré avec succès'
    ]);

} catch (Exception $e) {
    handleError('Erreur lors de l\'enregistrement: ' . $e->getMessage());
}
?>