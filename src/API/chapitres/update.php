<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
if (isset($data['name'])) {
	$sql = 'UPDATE `chapitres` SET `name` = ?, `module_id` = ? WHERE `id` = ?;';
	exequteSQL($db, $sql, [$data['name'], $data['module_id'], $data['id']]);
} else if (isset($data['module_id'])) {
	$sql = 'UPDATE `chapitres` SET `module_id` = ? WHERE `id` = ?;';
	exequteSQL($db, $sql, [$data['module_id'], $data['id']]);
} else if (isset($data['is_done'])) {
	$sql = 'UPDATE `chapitres` SET `is_done` = ? WHERE `id` = ?;';
	exequteSQL($db, $sql, [$data['is_done'], $data['id']]);
}
$db->close();
echo 'done';
?>