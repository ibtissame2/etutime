<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user_id($db, $data);

try {
    $requiredFields = ['file_name', 'file_path', 'file_type'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            throw new Exception("Le champ $field est requis", 400);
        }
    }
    
    $fileName = $data['file_name'];
    $filePath = $data['file_path'];
    $fileType = $data['file_type'];
    $errors = isset($data['errors']) ? json_encode($data['errors']) : null;
    
    // Liste étendue des types autorisés
    $allowedTypes = ['ical', 'csv', 'json', 'xml', 'pdf', 'document', 'spreadsheet', 'text', 'markdown', 'other'];
    if (!in_array($fileType, $allowedTypes)) {
        // Si le type n'est pas dans la liste, essayer de le détecter depuis le nom de fichier
        $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $typeMapping = [
            'ical' => 'ical',
            'ics' => 'ical',
            'csv' => 'csv',
            'json' => 'json',
            'xml' => 'xml',
            'pdf' => 'pdf',
            'doc' => 'document',
            'docx' => 'document',
            'xls' => 'spreadsheet',
            'xlsx' => 'spreadsheet',
            'txt' => 'text',
            'md' => 'markdown'
        ];
        $fileType = $typeMapping[$extension] ?? 'other';
    }
    
    $sql = "INSERT INTO imports (
                user_id, file_name, file_path, file_type, errors
            ) VALUES (?, ?, ?, ?, ?)";
    
    $importId = executeSQL($db, $sql, [$user_id, $fileName, $filePath, $fileType, $errors]);

    $sql = "SELECT id, file_name, file_path, file_type, errors, created_at
            FROM imports
            WHERE id = ?";
    
    $import = executeSQL($db, $sql, [$importId], false)[0];

    if ($import['errors']) {
        $import['errors'] = json_decode($import['errors'], true);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Import créé avec succès',
        'data' => $import
    ]);
    
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'debug' => [
            'input' => $data ?? null,
        ]
    ]);
}
?>