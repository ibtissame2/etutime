<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user_id($db, $data);

try {
    $sql = "SELECT 
            id, 
            user_id,
            file_name, 
            file_path,
            file_type, 
            import_type,
            errors,
            created_at, 
            updated_at
        FROM imports
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50";
    
    $imports = executeSQL($db, $sql, [$user_id], false);

    foreach ($imports as &$import) {
        if ($import['errors']) {
            $import['errors'] = json_decode($import['errors'], true);
        }
    }

    echo json_encode([
        'success' => true,
        'data' => $imports,
        'count' => count($imports)
    ]);
    
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>