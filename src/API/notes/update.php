<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user_id($db, $data);
$sql = 'UPDATE `notes` SET `title` = ?, `content` = ? WHERE `id` = ? AND `user_id` = ?;';
executeSQL($db, $sql, [$data['title'], json_encode($data['content']), $data['id'], $user_id]);
$db->close();
echo 'pass';
?>