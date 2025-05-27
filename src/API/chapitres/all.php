<?php
require_once __DIR__ . '/../database.php';

$data = getAxiosData();
$db = openDatabase();
$sql = 'SELECT ch.*, m.id AS module_id, m.name AS module, m.color AS color
        FROM chapitres ch
        LEFT JOIN modules m ON ch.module_id = m.id
        WHERE ch.user_id = ?';
$response = executeSQL($db, $sql, [$data['user']]);
$db->close();
echo $response;
?>