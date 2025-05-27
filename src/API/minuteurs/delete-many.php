<?php
require_once __DIR__ . '/../database.php';

$data = getAxiosData();
$db = openDatabase();
$placeholders = implode(',', array_fill(0, count($data['ids']), '?'));
$sql = "DELETE FROM `minuteurs` WHERE `user_id` = ? AND `id` IN ($placeholders)";
executeSQL($db, $sql, $data['user'], $data['ids']);
$db->close();
echo 'done';
?>