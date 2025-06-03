<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user($db);
$placeholders = implode(',', array_fill(0, count($data['ids']), '?'));
$sql = "DELETE FROM `minuteurs` WHERE `user_id` = ? AND `id` IN ($placeholders)";
executeSQL($db, $sql, array_merge([$user_id], $data['ids']));
$db->close();
echo 'done';
?>