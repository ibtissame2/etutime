<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$userId = get_user_id($db, $data);

try {
    // Vérifier si l'utilisateur a une session active
    $sessionQuery = "SELECT 
        id as session_id,
        is_active,
        is_paused,
        start_time,
        pause_time
        FROM sessions_etude 
        WHERE user_id = ? AND is_active = 1
        ORDER BY start_time DESC LIMIT 1";
    
    $stmt = $db->prepare($sessionQuery);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $session = $stmt->get_result()->fetch_assoc();

    if (!$session) {
        // Aucune session active - vérifier si l'utilisateur doit rejoindre une session
        $levelQuery = "SELECT niveau_concentration FROM questionnaire_resultats 
                      WHERE user_id = ? 
                      ORDER BY created_at DESC LIMIT 1";
        $stmt = $db->prepare($levelQuery);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $levelResult = $stmt->get_result()->fetch_assoc();

        if ($levelResult) {
            // Vérifier s'il y a des sessions actives avec le même niveau de concentration
            $activeSessionsQuery = "SELECT COUNT(*) as active_count 
                                  FROM sessions_etude se
                                  JOIN questionnaire_resultats qr ON qr.id = se.questionnaire_id
                                  WHERE qr.niveau_concentration = ? AND se.is_active = 1";
            
            $stmt = $db->prepare($activeSessionsQuery);
            $stmt->bind_param("s", $levelResult['niveau_concentration']);
            $stmt->execute();
            $activeCount = $stmt->get_result()->fetch_assoc()['active_count'];

            if ($activeCount > 0) {
                // Il y a des sessions actives - suggérer de rejoindre
                echo json_encode([
                    'success' => true,
                    'action' => 'start',
                    'message' => 'Des sessions actives sont disponibles'
                ]);
                exit;
            }
        }

        // Aucune action nécessaire
        echo json_encode([
            'success' => true,
            'action' => 'none',
            'message' => 'Aucune session active'
        ]);
        exit;
    }

    // Déterminer l'action nécessaire en fonction de l'état de la session
    if ($session['is_paused']) {
        echo json_encode([
            'success' => true,
            'action' => 'resume',
            'session_id' => $session['session_id'],
            'message' => 'Session en pause - peut reprendre'
        ]);
    } else {
        // Vérifier si la session est inactive depuis trop longtemps
        $lastActivity = strtotime($session['start_time']);
        $currentTime = time();
        $inactiveThreshold = 30 * 60; // 30 minutes

        if (($currentTime - $lastActivity) > $inactiveThreshold) {
            echo json_encode([
                'success' => true,
                'action' => 'pause',
                'session_id' => $session['session_id'],
                'message' => 'Session inactive depuis trop longtemps'
            ]);
        } else {
            // Session active - pas d'action nécessaire
            echo json_encode([
                'success' => true,
                'action' => 'none',
                'session_id' => $session['session_id'],
                'message' => 'Session active'
            ]);
        }
    }

} catch (Exception $e) {
    error_log("Erreur checkStudySession: " . $e->getMessage());
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($db)) $db->close();
}
?>