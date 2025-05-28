<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user_id($db, $data);
$sql = 'INSERT INTO `modules` (`name`, `color`, `user_id`) VALUES (?, ?, ?);';
$id = executeSQL($db, $sql, [$data['name'], $data['color'], $user_id]);
$db->close();
echo $id;
?>