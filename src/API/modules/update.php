<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
if (isset($data['name'])) {
	$sql = 'UPDATE `modules` SET `name` = ?, `color` = ? WHERE `id` = ?;';
	exequteSQL($db, $sql, [$data['name'], $data['color'], $data['id']]);
} else if (isset($data['progress'])) {
	$sql = 'UPDATE `modules` SET `progress` = ? WHERE `id` = ?;';
	exequteSQL($db, $sql, [$data['progress'], $data['id']]);
} else {
	$sql = 'UPDATE `modules` SET `is_public` = ? WHERE `id` = ?;';
	exequteSQL($db, $sql, [$data['is_public'], $data['id']]);
}
$db->close();
echo 'done';
?>