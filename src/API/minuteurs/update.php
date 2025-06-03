<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user($db);
$sql = 'UPDATE `minuteurs` SET `end` = ?, `start` = `start` WHERE `id` = ? AND `user_id` = ?;';
executeSQL($db, $sql, [$data['end'], $data['id'], $user_id]);
$db->close();
echo 'done';
?>