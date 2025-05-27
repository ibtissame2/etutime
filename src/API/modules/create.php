<?php
require_once __DIR__ . '/../database.php';

$data = getAxiosData();
$db = openDatabase();
$sql = 'INSERT INTO `modules` (`name`, `color`, `user_id`) VALUES (?, ?, ?);';
$id = executeSQL($db, $sql, [$data['name'], $data['color'], $data['user']]);
$db->close();
echo $id;
?>