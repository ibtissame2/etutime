<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();

try {
    // Récupérer l'ID utilisateur depuis la session
    $user = get_user_id($db, $data, true);
    $userId = $user['id'];

    // Récupérer d'abord le niveau de concentration depuis le dernier questionnaire
    $sqlQuestionnaire = "SELECT niveau_concentration, score_total, id as questionnaire_id
                        FROM questionnaire_resultats 
                        WHERE user_id = ? 
                        ORDER BY created_at DESC 
                        LIMIT 1";
    
    $questionnaireResult = executeSQL($db, $sqlQuestionnaire, [$userId], false);
    
    if (count($questionnaireResult) === 0) {
        echo json_encode([
            'success' => false,
            'data' => null,
            'message' => 'Aucun questionnaire trouvé. Veuillez d\'abord passer le questionnaire de niveau de concentration.'
        ]);
        exit;
    }

    $niveauConcentration = $questionnaireResult[0]['niveau_concentration'];
    $scoreTotal = $questionnaireResult[0]['score_total'];
    $questionnaireId = $questionnaireResult[0]['questionnaire_id'];

    // Maintenant récupérer l'emploi du temps s'il existe
    $sql = "SELECT 
                edt.emploi, 
                edt.horaire_fixe, 
                edt.module_id,
                edt.created_at, 
                edt.updated_at,
                m.name as module_nom
            FROM emplois_du_temps edt
            LEFT JOIN modules m ON edt.module_id = m.id
            WHERE edt.user_id = ?
            ORDER BY edt.updated_at DESC
            LIMIT 1";
    
    $result = executeSQL($db, $sql, [$userId], false);

    if (count($result) > 0) {
        $row = $result[0];
        echo json_encode([
            'success' => true,
            'data' => [
                'emploi' => json_decode($row['emploi']),
                'horaireFixe' => json_decode($row['horaire_fixe']) ?: null,
                'niveauConcentration' => $niveauConcentration,
                'scoreTotal' => $scoreTotal,
                'moduleId' => $row['module_id'],
                'moduleNom' => $row['module_nom'],
                'createdAt' => $row['created_at'],
                'updatedAt' => $row['updated_at']
            ]
        ]);
    } else {
        // Aucun emploi du temps trouvé, mais niveau de concentration disponible
        echo json_encode([
            'success' => true,
            'data' => [
                'emploi' => null,
                'horaireFixe' => null,
                'niveauConcentration' => $niveauConcentration,
                'scoreTotal' => $scoreTotal,
                'moduleId' => null,
                'moduleNom' => null,
                'createdAt' => null,
                'updatedAt' => null
            ],
            'message' => 'Aucun emploi du temps trouvé, mais niveau de concentration récupéré'
        ]);
    }

} catch (Exception $e) {
    error_log('Erreur get_emploi.php: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'data' => null,
        'message' => 'Erreur lors de la récupération: ' . $e->getMessage()
    ]);
}
?>