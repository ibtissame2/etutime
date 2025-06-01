<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$db = openDatabase();

try {
    // Récupérer le chemin du fichier depuis la query string
    $filePath = isset($_GET['path']) ? $_GET['path'] : '';
    
    if (empty($filePath)) {
        throw new Exception("Chemin du fichier manquant", 400);
    }

    // Sécurité : vérifier que le chemin est dans le dossier uploads
    $realBase = realpath(__DIR__ . '/../../uploads');
    $realPath = realpath(__DIR__ . '/../../' . $filePath);
    
    if ($realPath === false || strpos($realPath, $realBase) !== 0) {
        throw new Exception("Accès non autorisé", 403);
    }

    // Vérifier que le fichier existe
    if (!file_exists($realPath)) {
        throw new Exception("Fichier non trouvé", 404);
    }

    // Déterminer le type MIME
    $mimeTypes = [
        'pdf' => 'application/pdf',
        'csv' => 'text/csv',
        // Ajoutez d'autres types au besoin
    ];
    
    $extension = strtolower(pathinfo($realPath, PATHINFO_EXTENSION));
    $contentType = $mimeTypes[$extension] ?? mime_content_type($realPath);

    // Envoyer les headers et le fichier
    header('Content-Type: ' . $contentType);
    header('Content-Length: ' . filesize($realPath));
    readfile($realPath);
    exit;

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo $e->getMessage();
}
?>