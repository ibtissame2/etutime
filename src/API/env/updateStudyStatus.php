<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$userId = get_user_id($db, $data);

if (!isset($data['action'])) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['success' => false, 'message' => 'Action non spécifiée']);
    exit;
}

$action = $data['action'];
$allowedActions = ['pause', 'resume', 'stop'];

if (!in_array($action, $allowedActions)) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['success' => false, 'message' => 'Action non valide']);
    exit;
}

try {
    // Récupérer la session active de l'utilisateur
    $sessionQuery = "SELECT 
        se.id as session_id,
        se.minuteur_id,
        se.is_paused
        FROM sessions_etude se
        WHERE se.user_id = ? AND se.is_active = 1
        ORDER BY se.start_time DESC LIMIT 1";
    
    $stmt = $db->prepare($sessionQuery);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $session = $stmt->get_result()->fetch_assoc();

    if (!$session) {
        throw new Exception("Aucune session active trouvée");
    }

    // Traiter l'action demandée
    switch ($action) {
        case 'pause':
            if ($session['is_paused']) {
                throw new Exception("La session est déjà en pause");
            }
            
            // Mettre à jour la session
            $updateSession = "UPDATE sessions_etude 
                             SET is_paused = 1, pause_time = NOW() 
                             WHERE id = ?";
            $stmt = $db->prepare($updateSession);
            $stmt->bind_param("i", $session['session_id']);
            $stmt->execute();
            
            // Mettre à jour le minuteur
            $updateMinuteur = "UPDATE minuteurs SET end = NOW() WHERE id = ?";
            $stmt = $db->prepare($updateMinuteur);
            $stmt->bind_param("i", $session['minuteur_id']);
            $stmt->execute();
            
            break;
            
        case 'resume':
            if (!$session['is_paused']) {
                throw new Exception("La session n'est pas en pause");
            }
            
            // Mettre à jour la session
            $updateSession = "UPDATE sessions_etude 
                             SET is_paused = 0, pause_time = NULL 
                             WHERE id = ?";
            $stmt = $db->prepare($updateSession);
            $stmt->bind_param("i", $session['session_id']);
            $stmt->execute();
            
            // Créer un nouveau minuteur
            $newMinuteur = "INSERT INTO minuteurs (user_id, start) VALUES (?, NOW())";
            $stmt = $db->prepare($newMinuteur);
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $newMinuteurId = $stmt->insert_id;
            
            // Mettre à jour la session avec le nouveau minuteur
            $updateSessionMinuteur = "UPDATE sessions_etude 
                                    SET minuteur_id = ? 
                                    WHERE id = ?";
            $stmt = $db->prepare($updateSessionMinuteur);
            $stmt->bind_param("ii", $newMinuteurId, $session['session_id']);
            $stmt->execute();
            
            break;
            
        case 'stop':
            // Mettre à jour la session
            $updateSession = "UPDATE sessions_etude 
                             SET is_active = 0, is_paused = 0, end_time = NOW() 
                             WHERE id = ?";
            $stmt = $db->prepare($updateSession);
            $stmt->bind_param("i", $session['session_id']);
            $stmt->execute();
            
            // Mettre à jour le minuteur s'il n'est pas déjà terminé
            $checkMinuteur = "SELECT end FROM minuteurs WHERE id = ?";
            $stmt = $db->prepare($checkMinuteur);
            $stmt->bind_param("i", $session['minuteur_id']);
            $stmt->execute();
            $minuteurEnd = $stmt->get_result()->fetch_assoc()['end'];
            
            if (!$minuteurEnd) {
                $updateMinuteur = "UPDATE minuteurs SET end = NOW() WHERE id = ?";
                $stmt = $db->prepare($updateMinuteur);
                $stmt->bind_param("i", $session['minuteur_id']);
                $stmt->execute();
            }
            
            break;
    }

    echo json_encode([
        'success' => true,
        'session_id' => $session['session_id'],
        'action' => $action,
        'message' => "Session mise à jour avec succès"
    ]);

} catch (Exception $e) {
    error_log("Erreur updateStudyStatus: " . $e->getMessage());
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($db)) $db->close();
}
?>