<?php
require_once __DIR__ . '/../database.php';

$data = getAxiosData();
$db = openDatabase();
$sql = 'DELETE FROM `notes` WHERE `id` = ? AND `user_id` = ?;';
executeSQL($db, $sql, [$data['id'], $data['user']]);
$db->close();
echo 'done';
?>