<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user($db);
$sql = 'SELECT * FROM `taches` WHERE `user_id` = ?;';
$response = executeSQL($db, $sql, [$user_id]);
$db->close();
echo $response;
?>