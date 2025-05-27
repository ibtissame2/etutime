<?php
require_once __DIR__ . '/../database.php';

$data = getAxiosData();
$db = openDatabase();
$sql = 'INSERT INTO `taches` (`name`, `user_id`) VALUES (?, ?);';
$id = executeSQL($db, $sql, [$data['name'], $data['user']]);
$db->close();
echo $id;
?>