<?php
require_once __DIR__ . '/../database.php';

$data = getAxiosData();
$db = openDatabase();
$sql = 'INSERT INTO `notes` (`title`, `content`, `user_id`) VALUES (?, ?, ?);';
$id = executeSQL($db, $sql, [$data['title'], json_encode($data['content']), $data['user']]);
$db->close();
echo $id;
?>