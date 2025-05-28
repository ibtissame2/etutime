<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user_id = get_user_id($db);
if (isset($data['name'])) {
	$sql = 'UPDATE `chapitres` SET `name` = ?, `module_id` = ? WHERE `id` = ? AND `user_id` = ?;';
	executeSQL($db, $sql, [$data['name'], $data['module_id'], $data['id'], $user_id]);
} else if (isset($data['module_id'])) {
	$sql = 'UPDATE `chapitres` SET `module_id` = ? WHERE `id` = ? AND `user_id` = ?;';
	executeSQL($db, $sql, [$data['module_id'], $data['id'], $user_id]);
} else if (isset($data['is_done'])) {
	$sql = 'UPDATE `chapitres` SET `is_done` = ? WHERE `id` = ? AND `user_id` = ?;';
	executeSQL($db, $sql, [$data['is_done'], $data['id'], $user_id]);
}
$db->close();
echo 'done';
?>