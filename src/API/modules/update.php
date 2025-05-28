<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user_id($db);
if (isset($data['name'])) {
	$sql = 'UPDATE `modules` SET `name` = ?, `color` = ? WHERE `id` = ? AND `user_id` = ?;';
	executeSQL($db, $sql, [$data['name'], $data['color'], $data['id'], $user_id]);
} else if (isset($data['progress'])) {
	$sql = 'UPDATE `modules` SET `progress` = ? WHERE `id` = ? AND `user_id` = ?;';
	executeSQL($db, $sql, [$data['progress'], $data['id'], $user_id]);
} else {
	$sql = 'UPDATE `modules` SET `is_public` = ? WHERE `id` = ? AND `user_id` = ?;';
	executeSQL($db, $sql, [$data['is_public'], $data['id'], $user_id]);
}
$db->close();
echo 'done';
?>