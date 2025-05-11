<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$sql = 'UPDATE `notes` SET `title` = ?, `content` = ? WHERE `id` = ?;';
exequteSQL($db, $sql, [$data['title'], json_encode($data['content']), $data['id']]);
$db->close();
echo 'pass';
?>