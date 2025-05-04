<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$sql = 'INSERT INTO `taches` (`name`, `team_id`) VALUES (?, ?);';
exequteSQL($db, $sql, [$data['name'], $data['team']]);
$db->close();
echo 'done';
?>