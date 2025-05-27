<?php
require_once __DIR__ . '/../database.php';

$data = getAxiosData();
$db = openDatabase();
$sql = 'SELECT * FROM `modules` WHERE `user_id` = ?;';
$response = executeSQL($db, $sql, [$data['user']]);
$db->close();
echo $response;
?>