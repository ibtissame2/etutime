<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$placeholders = implode(',', array_fill(0, count($data['ids']), '?'));
$sql = "DELETE FROM `minuteurs` WHERE `id` IN ($placeholders)";
exequteSQL($db, $sql, $data['ids']);
$db->close();
echo 'done';
?>