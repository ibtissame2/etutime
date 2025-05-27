<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$placeholders = implode(',', array_fill(0, count($data['ids']), '?'));
$sql = "DELETE FROM `minuteurs` WHERE `user_id` = ? AND `id` IN ($placeholders)";
exequteSQL($db, $sql, $data['user'], $data['ids']);
$db->close();
echo 'done';
?>