<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$sql = 'DELETE FROM `taches` WHERE `id` = ? AND `user_id` = ?;';
exequteSQL($db, $sql, [$data['id'], $data['user']]);
$db->close();
echo 'done';
?>