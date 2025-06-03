<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

// Gestion des requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Vérifier la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée',
        'error_code' => 405,
    ]);
    exit();
}

try {
    // Enhanced debugging - log raw input
    $raw_post = file_get_contents('php://input');

    // Check if we have multipart data
    $content_type = $_SERVER['CONTENT_TYPE'] ?? '';

    if (!str_contains($content_type, 'multipart/form-data')) {
        throw new Exception('Content-Type must be multipart/form-data for file uploads. Received: ' . $content_type, 400);
    }

    // Récupérer les données POST et FILES
    $data = $_POST;
    $files = $_FILES;

    // Check for upload errors before processing
    if (empty($files) && empty($data)) {
        // Check if this might be due to size limits
        $max_post = ini_get('post_max_size');
        $max_upload = ini_get('upload_max_filesize');
        $content_length = $_SERVER['CONTENT_LENGTH'] ?? 0;

        // Convert sizes to bytes for comparison
        $max_post_bytes = parse_size($max_post);
        $max_upload_bytes = parse_size($max_upload);

        if ($content_length > $max_post_bytes) {
            throw new Exception("Fichier trop volumineux. Taille reçue: " . format_bytes($content_length) . ", limite POST: $max_post", 413);
        }

        if ($content_length > $max_upload_bytes) {
            throw new Exception("Fichier trop volumineux. Taille reçue: " . format_bytes($content_length) . ", limite upload: $max_upload", 413);
        }

        throw new Exception('Aucune donnée reçue. Vérifiez la configuration PHP et la méthode d\'envoi.', 400);
    }

    $db = openDatabase();

    // Enhanced credential checking
    $user_id = get_user($db);
    if (!$user_id) {
        throw new Exception('Utilisateur non authentifié ou session expirée. Données reçues: ' . print_r($data, true), 401);
    }
    if (!isset($files['file'])) {
        throw new Exception('Aucun fichier trouvé dans la requête. Clés disponibles: ' . implode(', ', array_keys($files)), 400);
    }

    $file = $files['file'];

    // Enhanced error checking
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $error_messages = [
            UPLOAD_ERR_INI_SIZE => 'Le fichier dépasse la limite upload_max_filesize (' . ini_get('upload_max_filesize') . ')',
            UPLOAD_ERR_FORM_SIZE => 'Le fichier dépasse la limite MAX_FILE_SIZE du formulaire',
            UPLOAD_ERR_PARTIAL => 'Le fichier n\'a été que partiellement uploadé',
            UPLOAD_ERR_NO_FILE => 'Aucun fichier n\'a été envoyé',
            UPLOAD_ERR_NO_TMP_DIR => 'Dossier temporaire manquant sur le serveur',
            UPLOAD_ERR_CANT_WRITE => 'Échec de l\'écriture du fichier (permissions?)',
            UPLOAD_ERR_EXTENSION => 'Upload arrêté par une extension PHP'
        ];

        $error_msg = $error_messages[$file['error']] ?? 'Erreur d\'upload inconnue: ' . $file['error'];
        throw new Exception($error_msg, 400);
    }

    // Enhanced file validation
    $maxFileSize = 10 * 1024 * 1024; // 10MB
    if ($file['size'] > $maxFileSize) {
        throw new Exception('Le fichier est trop volumineux (' . format_bytes($file['size']) . '). Maximum autorisé: ' . format_bytes($maxFileSize), 413);
    }

    if ($file['size'] === 0) {
        throw new Exception('Le fichier est vide', 400);
    }

    // Enhanced MIME type validation for DOCX
    $allowedExtensions = [
        'ical',
        'ics',
        'csv',
        'json',
        'xml',
        'pdf',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'txt',
        'md',
        'rtf'
    ];

    $pathInfo = pathinfo($file['name']);
    $extension = isset($pathInfo['extension']) ? strtolower($pathInfo['extension']) : '';

    if (empty($extension) || !in_array($extension, $allowedExtensions)) {
        throw new Exception('Type de fichier non autorisé. Extension détectée: "' . $extension . '". Extensions autorisées: ' . implode(', ', $allowedExtensions), 415);
    }

    // Enhanced MIME type checking for Office documents
    $allowedMimeTypes = [
        'text/calendar',
        'application/ics',
        'text/csv',
        'application/csv',
        'application/json',
        'text/json',
        'application/xml',
        'text/xml',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
        'text/plain',
        'text/markdown',
        'application/rtf',
        'application/octet-stream' // Fallback for some Office files
    ];

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    // Special handling for Office documents which might be detected as octet-stream
    if ($mimeType === 'application/octet-stream' && in_array($extension, ['docx', 'xlsx', 'doc', 'xls'])) {
        error_log("Allowing octet-stream for Office document: $extension");
    } else if (!in_array($mimeType, $allowedMimeTypes)) {
        throw new Exception("Type MIME non autorisé: $mimeType pour l'extension $extension", 415);
    }

    // File type mapping function
    function getFileTypeFromExtension($extension)
    {
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
            'md' => 'markdown',
            'rtf' => 'document'
        ];
        return $typeMapping[$extension] ?? 'other';
    }

    // Enhanced directory creation
    $uploadDir = __DIR__ . '/../../uploads/imports/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            $error = error_get_last();
            throw new Exception('Impossible de créer le répertoire d\'upload: ' . ($error['message'] ?? 'Erreur inconnue'), 500);
        }
    }

    if (!is_writable($uploadDir)) {
        throw new Exception('Le répertoire d\'upload n\'est pas accessible en écriture. Permissions: ' . substr(sprintf('%o', fileperms($uploadDir)), -4), 500);
    }

    // Enhanced filename generation
    $sanitizedFileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $pathInfo['filename']);
    $fileName = $user_id . '_' . date('Y-m-d_H-i-s') . '_' . uniqid() . '_' . $sanitizedFileName . '.' . $extension;
    $filePath = $uploadDir . $fileName;

    // Enhanced file move with error checking
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        $error = error_get_last();
        throw new Exception('Erreur lors de la sauvegarde du fichier: ' . ($error['message'] ?? 'Erreur inconnue'), 500);
    }

    // Verify file was created successfully
    if (!file_exists($filePath)) {
        throw new Exception('Le fichier n\'a pas pu être sauvegardé (fichier introuvable après création)', 500);
    }

    $relativePath = 'uploads/imports/' . $fileName;
    $detectedFileType = getFileTypeFromExtension($extension);
    $fileSize = filesize($filePath);

    // Enhanced success response
    echo json_encode([
        'success' => true,
        'message' => 'Fichier uploadé avec succès',
        'file_path' => $relativePath,
        'file_type' => $detectedFileType,
    ]);

} catch (Exception $e) {
    // Enhanced cleanup
    if (isset($filePath) && file_exists($filePath)) {
        unlink($filePath);
    }

    $statusCode = $e->getCode() ?: 500;
    http_response_code($statusCode);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error_code' => $statusCode,
    ]);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur serveur interne',
        'error_code' => 500,
    ]);
}

// Helper functions
function parse_size($size)
{
    $unit = preg_replace('/[^bkmgtpezy]/i', '', $size);
    $size = preg_replace('/[^0-9\.]/', '', $size);
    if ($unit) {
        return round($size * pow(1024, stripos('bkmgtpezy', $unit[0])));
    }
    return round($size);
}

function format_bytes($size, $precision = 2)
{
    $base = log($size, 1024);
    $suffixes = array('B', 'KB', 'MB', 'GB', 'TB');
    return round(pow(1024, $base - floor($base)), $precision) . ' ' . $suffixes[floor($base)];
}
?>