<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user($db);

try {
    if (empty($data['import_id'])) {
        throw new Exception("L'ID de l'import est requis", 400);
    }

    // Récupérer les informations de l'import avant suppression
    $sql = "SELECT id, file_path, user_id 
            FROM imports 
            WHERE id = ? AND user_id = ?";

    $import = executeSQL($db, $sql, [$data['import_id'], $user_id], false);

    if (empty($import)) {
        throw new Exception("Import non trouvé ou vous n'avez pas les droits", 404);
    }

    $import = $import[0];

    // Supprimer le fichier physique s'il existe
    if (!empty($import['file_path'])) {
        $filePath = __DIR__ . '/../../' . $import['file_path'];
        if (file_exists($filePath)) {
            if (!unlink($filePath)) {
                throw new Exception("Impossible de supprimer le fichier physique", 500);
            }
        }
    }

    // Supprimer l'entrée dans la base de données
    $sql = "DELETE FROM imports WHERE id = ? AND user_id = ?";
    $deleted = executeSQL($db, $sql, [$data['import_id'], $user_id]);

    if ($deleted === 0) {
        throw new Exception("Aucun import supprimé", 404);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Import et fichier supprimés avec succès'
    ]);

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>