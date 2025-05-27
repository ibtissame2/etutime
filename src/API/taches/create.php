<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$sql = 'INSERT INTO `taches` (`name`, `user_id`) VALUES (?, ?);';
$id = exequteSQL($db, $sql, [$data['name'], $data['user']]);
$db->close();
echo $id;
?>