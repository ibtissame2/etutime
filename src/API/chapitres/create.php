<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$sql = 'INSERT INTO `chapitres` (`name`, `module_id`, `team_id`, `user_id`) VALUES (?, ?, ?, ?);';
$id = exequteSQL($db, $sql, [$data['name'], $data['module_id'], $data['team'], $data['user']]);
$db->close();
echo $id;
?>