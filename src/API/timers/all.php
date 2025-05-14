<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$sql = 'SELECT t.*, ch.name as chapitre_name, ch.module_id as chapitre_module_id
        FROM timers t
        LEFT JOIN chapitres ch ON ch.id = t.chapitre_id
        WHERE t.team_id = ?';
$response = exequteSQL($db, $sql, [$data['team']]);
$db->close();
echo $response;
?>