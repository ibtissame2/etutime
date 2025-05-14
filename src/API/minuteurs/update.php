<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$sql = 'UPDATE `minuteurs` SET `end` = ? WHERE `id` = ?;';
exequteSQL($db, $sql, [$data['end'], $data['id']]);
$db->close();
echo 'done';
?>