<?php
require_once __DIR__ . '/../database.php';

$data = getAxiosData();
$db = openDatabase();
$sql = 'UPDATE `notes` SET `title` = ?, `content` = ? WHERE `id` = ? AND `user_id` = ?;';
executeSQL($db, $sql, [$data['title'], json_encode($data['content']), $data['id'], $data['user']]);
$db->close();
echo 'pass';
?>