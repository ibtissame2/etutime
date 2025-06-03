<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user($db);

try {
    // 1. Récupérer le niveau de concentration de l'utilisateur actuel
    $levelQuery = "SELECT niveau_concentration as concentration, level
        FROM questionnaire_resultats q
        JOIN users u ON q.user_id = u.id 
        WHERE user_id = ?";
    $result = executeSQL($db, $levelQuery, [$user_id], false);
    if (empty($result)) {
        throw new Exception("Niveau de concentration non trouvé");
    }
    $userConcentration = $result[0]['concentration'];
    $userLevel = $result[0]['level'];

    // 2. Récupérer les utilisateurs avec le même niveau
    $usersQuery = "SELECT u.id as id, CONCAT(u.first_name, ' ', u.last_name) as name
        FROM users u JOIN questionnaire_resultats qr ON qr.user_id = u.id
        WHERE niveau_concentration = ? AND level = ?";
    $users = executeSQL($db, $usersQuery, [$userConcentration, $userLevel], false);
    $user_ids = [];
    foreach ($users as $user) {
        $user_ids[] = $user['id'];
    }

    // 3. Récupérer les minuteurs actifs
    $startOfWeek = $data['startDate'];
    $placeholders = implode(',', array_fill(0, count($user_ids), '?'));
    $minuteursQuery = "SELECT user_id, start, end FROM minuteurs WHERE start >= ? AND user_id IN ($placeholders)";
    $minuteurs = executeSQL($db, $minuteursQuery, array_merge([$startOfWeek], $user_ids), false);
    $minuteursById = [];
    foreach ($minuteurs as $minuteur) {
        if (!isset($minuteursByUser[$minuteur['user_id']])) {
            $minuteursByUser[$minuteur['user_id']] = ['is_active' => false, 'minuteurs' => []];
        }
        if ($minuteur['end'] == null) {
            $minuteursByUser[$minuteur['user_id']]['is_active'] = true;
        }
        $minuteursByUser[$minuteur['user_id']]['minuteurs'][] = [$minuteur['start'], $minuteur['end']];
    }

    $formatted = [];
    foreach ($users as $user) {
        if (!isset($minuteursByUser[$user['id']])) {
            $minuteursByUser[$user['id']] = ['is_active' => false, 'minuteurs' => []];
        }
        $formatted[] = [
            'name' => $user['name'],
            'current_user' => $user['id'] == $user_id,
            'is_active' => $minuteursByUser[$user['id']]['is_active'],
            'minuteurs' => $minuteursByUser[$user['id']]['minuteurs'],
        ];
    }

    echo json_encode([
        'success' => true,
        'participants' => $formatted,
    ]);
    $db->close();
} catch (Exception $e) {
    error_log("Erreur: " . $e->getMessage());
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    $db->close();
}
?>