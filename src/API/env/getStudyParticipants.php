<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$userId = get_user_id($db, $data);

try {
    // 1. Récupérer le niveau de concentration de l'utilisateur actuel
    $levelQuery = "SELECT niveau_concentration FROM questionnaire_resultats 
                  WHERE user_id = ? 
                  ORDER BY created_at DESC LIMIT 1";
    $stmt = $db->prepare($levelQuery);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    
    if (!$result) {
        throw new Exception("Niveau de concentration non trouvé");
    }
    
    $userLevel = $result['niveau_concentration'];

    // 2. Récupérer les utilisateurs avec le même niveau
    $usersQuery = "SELECT 
        u.id as user_id,
        CONCAT(u.first_name, ' ', u.last_name) as name,
        u.email,
        IFNULL(se.is_active, 0) as is_active,
        IFNULL(se.is_paused, 0) as is_paused,
        IFNULL(se.start_time, NULL) as session_start,
        IFNULL(se.id, NULL) as session_id,
        (u.id = ?) as is_current_user
        FROM users u
        JOIN questionnaire_resultats qr ON qr.user_id = u.id
        LEFT JOIN sessions_etude se ON se.user_id = u.id AND se.is_active = 1
        WHERE qr.niveau_concentration = ?
        ORDER BY se.is_active DESC, se.start_time ASC";

    $stmt = $db->prepare($usersQuery);
    $stmt->bind_param("is", $userId, $userLevel);
    $stmt->execute();
    $participants = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // 3. Récupérer les minuteurs actifs
    // Dans getStudyParticipants.php, modifier la requête SQL pour les minuteurs actifs
$minuteursQuery = "SELECT 
    user_id, 
    TIMESTAMPDIFF(SECOND, start, IFNULL(end, NOW())) as duration_seconds,
    IFNULL(end, NOW()) as end_time
    FROM minuteurs 
    WHERE (end IS NULL OR end >= NOW() - INTERVAL 1 HOUR) 
    AND user_id IN (SELECT user_id FROM questionnaire_resultats WHERE niveau_concentration = ?)";
    
    $stmt = $db->prepare($minuteursQuery);
    $stmt->bind_param("s", $userLevel);
    $stmt->execute();
    $minuteurs = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    $durations = [];
    foreach ($minuteurs as $minuteur) {
        $userId = $minuteur['user_id'];
        $durations[$userId] = ($durations[$userId] ?? 0) + $minuteur['duration_seconds'];
    }

    // Formatage des résultats
    // Modifiez la partie qui calcule le temps d'étude pour chaque participant
$formatted = array_map(function($p) use ($durations) {
    $studySeconds = $durations[$p['user_id']] ?? 0;
    if ($p['is_active'] && $p['session_start'] && !$p['is_paused']) {
        $studySeconds += time() - strtotime($p['session_start']);
    }
    
    return [
        'user_id' => $p['user_id'],
        'name' => $p['name'],
        'email' => $p['email'],
        'is_active' => (bool)$p['is_active'],
        'is_paused' => (bool)$p['is_paused'],
        'study_time' => $studySeconds, // Envoyez les secondes directement
        'session_start' => $p['session_start'], // Ajoutez le timestamp de début
        'is_current_user' => (bool)$p['is_current_user'],
        'session_id' => $p['session_id']
    ];
}, $participants);

    echo json_encode([
        'success' => true,
        'participants' => $formatted,
        'concentration_level' => $userLevel
    ]);

} catch (Exception $e) {
    error_log("Erreur: " . $e->getMessage());
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($db)) $db->close();
}
?>