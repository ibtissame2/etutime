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

    // Récupérer le dernier questionnaire de l'utilisateur
    $sql = "SELECT 
                id,
                niveau_concentration,
                score_total,
                created_at,
                updated_at
            FROM questionnaire_resultats 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 1";
    
    $results = executeSQL($db, $sql, [$userId], false);

    if (empty($results)) {
        $response = [
            'success' => true,
            'message' => 'Aucun questionnaire trouvé',
            'data' => null,
            'has_questionnaire' => false
        ];
    } else {
        $questionnaire = $results[0];
        
        $questionnaire['created_at'] = date('Y-m-d H:i:s', strtotime($questionnaire['created_at']));
        if ($questionnaire['updated_at']) {
            $questionnaire['updated_at'] = date('Y-m-d H:i:s', strtotime($questionnaire['updated_at']));
        }

        $createdTime = strtotime($questionnaire['created_at']);
        $currentTime = time();
        $ageInHours = ($currentTime - $createdTime) / 3600;

        $response = [
            'success' => true,
            'message' => 'Questionnaire récupéré avec succès',
            'data' => [
                'id' => intval($questionnaire['id']),
                'niveau_concentration' => $questionnaire['niveau_concentration'],
                'score_total' => intval($questionnaire['score_total']),
                'created_at' => $questionnaire['created_at'],
                'updated_at' => $questionnaire['updated_at'],
                'age_hours' => round($ageInHours, 2),
                'is_recent' => $ageInHours <= 24
            ],
            'has_questionnaire' => true
        ];
    }

    // Optionnel : Récupérer aussi les statistiques générales
    if (isset($_GET['include_stats']) && $_GET['include_stats'] === 'true') {
        $statsSql = "SELECT 
                        COUNT(*) as total_questionnaires,
                        AVG(score_total) as score_moyen,
                        niveau_concentration as niveau_frequent
                     FROM questionnaire_resultats 
                     WHERE user_id = ?
                     GROUP BY niveau_concentration
                     ORDER BY COUNT(*) DESC
                     LIMIT 1";
        
        $stats = executeSQL($db, $statsSql, [$userId], false);
        
        if (!empty($stats)) {
            $response['statistics'] = [
                'total_questionnaires' => intval($stats[0]['total_questionnaires']),
                'score_moyen' => round(floatval($stats[0]['score_moyen']), 2),
                'niveau_frequent' => $stats[0]['niveau_frequent']
            ];
        }
    }

    echo json_encode($response);

} catch (Exception $e) {
    error_log("Erreur get_questionnaire.php: " . $e->getMessage());
    handleError('Erreur lors de la récupération: ' . $e->getMessage(), 500);
}
?>