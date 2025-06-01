<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

// Récupérer les données POST (y compris les credentials)
$data = $_POST;
$files = $_FILES;
$db = openDatabase();

try {
    // Vérification de l'utilisateur via les credentials
    $user_id = get_user_id($db, $data);
    
    if (!isset($files['file']) || $files['file']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Aucun fichier valide n\'a été envoyé', 400);
    }

    $file = $files['file'];
    
    $maxFileSize = 10 * 1024 * 1024; // 10MB
    if ($file['size'] > $maxFileSize) {
        throw new Exception('Le fichier est trop volumineux (max 10MB)', 400);
    }
    
    $allowedExtensions = ['ical', 'ics', 'csv', 'json', 'xml', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'md'];
    $pathInfo = pathinfo($file['name']);
    $extension = strtolower($pathInfo['extension']);
    
    if (!in_array($extension, $allowedExtensions)) {
        throw new Exception('Type de fichier non autorisé. Extensions autorisées: ' . implode(', ', $allowedExtensions), 400);
    }
    
    // Fonction pour déterminer le type de fichier basé sur l'extension
    function getFileTypeFromExtension($extension) {
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
        return $typeMapping[$extension] ?? 'other';
    }
    
    $uploadDir = __DIR__ . '/../../uploads/imports/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception('Impossible de créer le répertoire d\'upload', 500);
        }
    }
    
    $fileName = $user_id . '_' . date('Y-m-d_H-i-s') . '_' . uniqid() . '.' . $extension;
    $filePath = $uploadDir . $fileName;
    
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        throw new Exception('Erreur lors de la sauvegarde du fichier', 500);
    }
    
    $relativePath = 'uploads/imports/' . $fileName;
    $detectedFileType = getFileTypeFromExtension($extension);

    echo json_encode([
        'success' => true,
        'message' => 'Fichier uploadé avec succès',
        'file_path' => $relativePath,
        'original_name' => $file['name'],
        'size' => $file['size'],
        'extension' => $extension,
        'file_type' => $detectedFileType
    ]);
    
} catch (Exception $e) {
    if (isset($filePath) && file_exists($filePath)) {
        unlink($filePath);
    }

    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'debug' => [
            'files' => $files ?? 'NO_FILES'
        ]
    ]);
}
?>