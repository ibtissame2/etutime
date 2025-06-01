<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$userId = get_user_id($db, $data);

try {
    // Vérifier si l'utilisateur a déjà une session active
    $existingSessionQuery = "SELECT id FROM sessions_etude WHERE user_id = ? AND is_active = 1";
    $stmt = $db->prepare($existingSessionQuery);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $existingSession = $stmt->get_result()->fetch_assoc();

    if ($existingSession) {
        echo json_encode([
            'success' => false,
            'message' => 'Une session est déjà active pour cet utilisateur'
        ]);
        exit;
    }

    // Récupérer le dernier questionnaire de l'utilisateur
    $questionnaireQuery = "SELECT id, niveau_concentration FROM questionnaire_resultats 
                          WHERE user_id = ? 
                          ORDER BY created_at DESC LIMIT 1";
    $stmt = $db->prepare($questionnaireQuery);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $questionnaire = $stmt->get_result()->fetch_assoc();

    if (!$questionnaire) {
        throw new Exception("Aucun questionnaire trouvé pour l'utilisateur");
    }

    // Créer un nouveau minuteur
    $minuteurQuery = "INSERT INTO minuteurs (user_id, start) VALUES (?, NOW())";
    $stmt = $db->prepare($minuteurQuery);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $minuteurId = $stmt->insert_id;

    // Créer une nouvelle session d'étude
    $sessionQuery = "INSERT INTO sessions_etude 
                    (user_id, minuteur_id, questionnaire_id, is_active, start_time) 
                    VALUES (?, ?, ?, 1, NOW())";
    
    $stmt = $db->prepare($sessionQuery);
    $stmt->bind_param("iii", $userId, $minuteurId, $questionnaire['id']);
    $stmt->execute();
    $sessionId = $stmt->insert_id;

    echo json_encode([
        'success' => true,
        'session_id' => $sessionId,
        'minuteur_id' => $minuteurId,
        'concentration_level' => $questionnaire['niveau_concentration'],
        'message' => 'Session d\'étude démarrée avec succès'
    ]);

} catch (Exception $e) {
    error_log("Erreur joinStudySpace: " . $e->getMessage());
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($db)) $db->close();
}
?>