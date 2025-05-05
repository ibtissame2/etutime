<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$sql = 'DELETE FROM `chapitres` WHERE `id` = ?;';
exequteSQL($db, $sql, [$data['id']]);
$db->close();
echo 'done';
?>