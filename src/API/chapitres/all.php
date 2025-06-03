<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user($db);
$sql = 'SELECT ch.*, m.id AS module_id, m.name AS module, m.color AS color
        FROM chapitres ch
        LEFT JOIN modules m ON ch.module_id = m.id
        WHERE ch.user_id = ?';
$response = executeSQL($db, $sql, [$user_id]);
$db->close();
echo $response;
?>