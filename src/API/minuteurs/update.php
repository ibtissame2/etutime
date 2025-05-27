<?php
require_once __DIR__ . '/../database.php';

$data = getAxiosData();
$db = openDatabase();
$sql = 'UPDATE `minuteurs` SET `end` = ?, `start` = `start` WHERE `id` = ? AND `user_id` = ?;';
executeSQL($db, $sql, [$data['end'], $data['id'], $data['user']]);
$db->close();
echo 'done';
?>