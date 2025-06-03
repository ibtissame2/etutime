<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user($db);
$sql = 'INSERT INTO `notes` (`title`, `content`, `user_id`) VALUES (?, ?, ?);';
$id = executeSQL($db, $sql, [$data['title'], json_encode($data['content']), $user_id]);
$db->close();
echo $id;
?>