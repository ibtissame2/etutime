<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user_id($db, $data);

try {
    if (empty($data['import_id'])) {
        throw new Exception("L'ID de l'import est requis", 400);
    }
    
    // Vérifier que l'import appartient à l'utilisateur
    $sql = "SELECT id, file_path, file_name, file_type FROM imports WHERE id = ? AND user_id = ?";
    $import = executeSQL($db, $sql, [$data['import_id'], $user_id], false);
    
    if (empty($import)) {
        throw new Exception("Import introuvable ou accès refusé", 404);
    }
    
    $import = $import[0];
    $filePath = __DIR__ . '/../../' . $import['file_path'];
    
    if (!file_exists($filePath)) {
        throw new Exception("Fichier non trouvé sur le serveur", 404);
    }
    
    $fileSize = filesize($filePath);
    
    // Détecter le type de fichier à partir de l'extension si nécessaire
    $extension = strtolower(pathinfo($import['file_name'], PATHINFO_EXTENSION));
    $fileType = strtolower($import['file_type']);
    
    // Si le type en base ne correspond pas à l'extension, utiliser l'extension
    if ($fileType === 'other' || empty($fileType)) {
        $typeMapping = [
            'pdf' => 'pdf',
            'doc' => 'document',
            'docx' => 'document',
            'xls' => 'spreadsheet',
            'xlsx' => 'spreadsheet',
            'csv' => 'csv',
            'json' => 'json',
            'xml' => 'xml',
            'ical' => 'ical',
            'ics' => 'ical',
            'txt' => 'text',
            'md' => 'markdown'
        ];
        $fileType = $typeMapping[$extension] ?? $extension;
    }
    
    $content = '';
    $isText = false;
    $encoding = 'UTF-8';
    $canDisplay = true;
    $displayMessage = '';
    $isPdf = false;
    $fileUrl = '';
    
    // Déterminer le type de contenu et lire le fichier
    switch ($fileType) {
        case 'csv':
            $maxSize = 5 * 1024 * 1024; // 5MB limite pour les fichiers texte
            if ($fileSize > $maxSize) {
                throw new Exception("Le fichier est trop volumineux pour être affiché (max 5MB)", 400);
            }
            $content = file_get_contents($filePath);
            $isText = true;
            break;
            
        case 'json':
            $maxSize = 5 * 1024 * 1024; // 5MB limite pour les fichiers texte
            if ($fileSize > $maxSize) {
                throw new Exception("Le fichier est trop volumineux pour être affiché (max 5MB)", 400);
            }
            $jsonContent = file_get_contents($filePath);
            $content = json_encode(json_decode($jsonContent), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            $isText = true;
            break;
            
        case 'xml':
            $maxSize = 5 * 1024 * 1024; // 5MB limite pour les fichiers texte
            if ($fileSize > $maxSize) {
                throw new Exception("Le fichier est trop volumineux pour être affiché (max 5MB)", 400);
            }
            $xmlContent = file_get_contents($filePath);
            $dom = new DOMDocument();
            $dom->preserveWhiteSpace = false;
            $dom->formatOutput = true;
            if ($dom->loadXML($xmlContent)) {
                $content = $dom->saveXML();
            } else {
                $content = $xmlContent;
            }
            $isText = true;
            break;
            
        case 'ical':
        case 'ics':
            $maxSize = 5 * 1024 * 1024; // 5MB limite pour les fichiers texte
            if ($fileSize > $maxSize) {
                throw new Exception("Le fichier est trop volumineux pour être affiché (max 5MB)", 400);
            }
            $content = file_get_contents($filePath);
            $isText = true;
            break;
            
        case 'txt':
        case 'text':
        case 'md':
        case 'markdown':
            $maxSize = 5 * 1024 * 1024; // 5MB limite pour les fichiers texte
            if ($fileSize > $maxSize) {
                throw new Exception("Le fichier est trop volumineux pour être affiché (max 5MB)", 400);
            }
            $content = file_get_contents($filePath);
            $isText = true;
            break;
            
        case 'pdf':
    $isPdf = true;
    $canDisplay = true;
    
    // Construire l'URL absolue
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
    $host = $_SERVER['HTTP_HOST'];
    $basePath = '/etutime/front-end/src/'; // Ajustez selon votre structure
    
    // Supprimer le 'uploads/' du début si présent
    $cleanPath = ltrim($import['file_path'], 'uploads/');
    $fileUrl = $protocol . $host . $basePath . 'uploads/' . $cleanPath;
    
    break;
            
        case 'document':
        case 'doc':
        case 'docx':
            $canDisplay = false;
            $displayMessage = "Les documents Word ne peuvent pas être affichés directement. Téléchargez le fichier pour le visualiser.";
            break;
            
        case 'spreadsheet':
        case 'xls':
        case 'xlsx':
            $canDisplay = false;
            $displayMessage = "Les fichiers Excel ne peuvent pas être affichés directement. Téléchargez le fichier pour le visualiser.";
            break;
            
        default:
            // Pour les autres types, essayer de lire comme texte
            $maxSize = 5 * 1024 * 1024; // 5MB limite pour les fichiers texte
            if ($fileSize > $maxSize) {
                throw new Exception("Le fichier est trop volumineux pour être affiché (max 5MB)", 400);
            }
            $content = file_get_contents($filePath);
            // Vérifier si c'est du texte valide
            if (mb_check_encoding($content, 'UTF-8')) {
                $isText = true;
            } else {
                $canDisplay = false;
                $displayMessage = "Ce type de fichier ne peut pas être affiché en mode texte.";
            }
            break;
    }
    
    // Détecter l'encodage si nécessaire pour les fichiers texte
    if ($isText && $canDisplay && !mb_check_encoding($content, 'UTF-8')) {
        $detected = mb_detect_encoding($content, ['UTF-8', 'ISO-8859-1', 'Windows-1252'], true);
        if ($detected && $detected !== 'UTF-8') {
            $content = mb_convert_encoding($content, 'UTF-8', $detected);
            $encoding = $detected;
        }
    }
    
    echo json_encode([
    'success' => true,
    'data' => [
        'content' => $canDisplay ? $content : '',
        'file_name' => $import['file_name'],
        'file_path' => $import['file_path'],
            'file_extension' => $extension,
            'file_size' => $fileSize,
            'is_text' => $isText,
            'is_pdf' => $isPdf,
            'can_display' => $canDisplay,
            'display_message' => $displayMessage,
            'encoding' => $encoding,
            'file_url' => $fileUrl,
            'lines_count' => ($isText && $canDisplay) ? substr_count($content, "\n") + 1 : 0
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>