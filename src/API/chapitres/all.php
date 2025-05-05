<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$sql = 'SELECT ch.*, m.id AS module_id, m.name AS module, m.color AS color
        FROM chapitres ch
        LEFT JOIN modules m ON ch.module_id = m.id
        WHERE ch.team_id = ?';
$response = exequteSQL($db, $sql, [$data['team']]);
$db->close();
echo $response;
?>