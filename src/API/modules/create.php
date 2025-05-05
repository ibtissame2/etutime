<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$sql = 'INSERT INTO `modules` (`name`, `color`, `team_id`) VALUES (?, ?, ?);';
$id = exequteSQL($db, $sql, [$data['name'], $data['color'], $data['team']]);
$db->close();
echo $id;
?>