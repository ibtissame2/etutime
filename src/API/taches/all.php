<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$sql = 'SELECT * FROM `taches` WHERE `user_id` = ?;';
$response = exequteSQL($db, $sql, [$data['user']]);
$db->close();
echo $response;
?>