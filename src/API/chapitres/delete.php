<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$sql = 'DELETE FROM `chapitres` WHERE `id` = ? AND `user_id` = ?;';
executeSQL($db, $sql, [$data['id'], get_user_id($db)]);
$db->close();
echo 'done';
?>