<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$sql = 'SELECT * FROM `modules` WHERE `team_id` = ?;';
$response = exequteSQL($db, $sql, [$data['team']]);
$db->close();
echo $response;
?>