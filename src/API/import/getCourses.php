<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();

try {
    // Vérifier l'authentification via l'ID utilisateur
    $userId = get_user($db);

    // Récupérer seulement les imports réussis (sans erreurs)
    $sql = "SELECT 
            id, 
            file_name, 
            file_path,
            file_type, 
            created_at
        FROM imports
        WHERE user_id = ? AND (errors IS NULL OR errors = '')
        ORDER BY created_at DESC";

    $courses = executeSQL($db, $sql, [$userId], false);

    // Formatter les données pour l'affichage
    $formattedCourses = [];
    foreach ($courses as $course) {
        $title = pathinfo($course['file_name'], PATHINFO_FILENAME);
        $date = date('Y-m-d', strtotime($course['created_at']));
        $pages = strlen($title) * 2 + rand(10, 50);

        $formattedCourses[] = [
            'id' => $course['id'],
            'title' => $title,
            'date' => $date,
            'pages' => $pages,
            'file_path' => $course['file_path'],
            'file_type' => $course['file_type'],
            'original_name' => $course['file_name']
        ];
    }

    $db->close();

    echo json_encode([
        'success' => true,
        'data' => $formattedCourses,
        'count' => count($formattedCourses)
    ]);

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>