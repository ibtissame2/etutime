<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user_id($db, $data);
$sql = 'INSERT INTO `taches` (`name`, `user_id`) VALUES (?, ?);';
$id = executeSQL($db, $sql, [$data['name'], $user_id]);
$db->close();
echo $id;
?>