<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();

try {
    // Récupérer l'utilisateur complet depuis la session
    $user = get_user_id($db, $data, true);
    if (!$user) {
        handleError('Utilisateur non connecté', 401);
    }
    $userId = $user['id'];

    if (empty($data)) {
        handleError('Aucune donnée reçue', 400);
    }

    // Valider les données requises
    if (!isset($data['niveau']) || !isset($data['scoreTotal'])) {
        handleError('Données manquantes (niveau ou scoreTotal)', 400);
    }

    $niveau = trim($data['niveau']);
    $scoreTotal = intval($data['scoreTotal']);

    // Valider le niveau de concentration
    $niveauxValides = ['faible', 'moyen', 'élevé'];
    if (!in_array($niveau, $niveauxValides)) {
        handleError('Niveau de concentration invalide: ' . $niveau, 400);
    }

    // Valider le score
    if ($scoreTotal < 0 || $scoreTotal > 100) {
        handleError('Score total invalide (doit être entre 0 et 100)', 400);
    }

    // Vérifier si l'utilisateur a déjà un questionnaire récent
    $checkSql = "SELECT id, created_at FROM questionnaire_resultats 
                 WHERE user_id = ? 
                 AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
                 ORDER BY created_at DESC 
                 LIMIT 1";
    
    $existing = executeSQL($db, $checkSql, [$userId], false);

    if (!empty($existing)) {
        // Mettre à jour le questionnaire existant
        $questionnaireId = $existing[0]['id'];
        $updateSql = "UPDATE questionnaire_resultats 
                      SET niveau_concentration = ?, 
                          score_total = ?, 
                          updated_at = CURRENT_TIMESTAMP 
                      WHERE id = ? AND user_id = ?";
        
        executeSQL($db, $updateSql, [$niveau, $scoreTotal, $questionnaireId, $userId]);
        
        $response = [
            'success' => true,
            'message' => 'Questionnaire mis à jour avec succès',
            'action' => 'updated',
            'data' => [
                'id' => $questionnaireId,
                'niveau_concentration' => $niveau,
                'score_total' => $scoreTotal,
                'user_id' => $userId
            ]
        ];
    } else {
        // Créer un nouveau questionnaire
        $insertSql = "INSERT INTO questionnaire_resultats (user_id, niveau_concentration, score_total) 
                      VALUES (?, ?, ?)";
        
        $questionnaireId = executeSQL($db, $insertSql, [$userId, $niveau, $scoreTotal]);
        
        $response = [
            'success' => true,
            'message' => 'Questionnaire sauvegardé avec succès',
            'action' => 'created',
            'data' => [
                'id' => $questionnaireId,
                'niveau_concentration' => $niveau,
                'score_total' => $scoreTotal,
                'user_id' => $userId
            ]
        ];
    }

    echo json_encode($response);

} catch (Exception $e) {
    error_log("Erreur save_questionnaire.php: " . $e->getMessage());
    handleError('Erreur lors de la sauvegarde: ' . $e->getMessage(), 500);
}
?>