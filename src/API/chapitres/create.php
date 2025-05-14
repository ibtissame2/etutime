<?php
require_once __DIR__ . '/../database.php';

function createChapitreIfNotExist($db, $data, $throwError = false)
{
	if (!$data['name']) {
		if (!$throwError)
			return ["chapitre_id" => null, "module_id" => $data['module_id']];
		http_response_code(400);
		echo json_encode(["error" => "Missing chapitre name"]);
		return ["chapitre_id" => null, "module_id" => null];
	}
	$response = [];
	if ($data['module_id']) {
		$sql = 'SELECT id, module_id FROM `chapitres` WHERE `name` = ? AND `module_id` = ? LIMIT 1;';
		$response = exequteSQL($db, $sql, [$data['name'], $data['module_id']], false);
	} else {
		$sql = 'SELECT id, module_id FROM `chapitres` WHERE `name` = ? LIMIT 1;';
		$response = exequteSQL($db, $sql, [$data['name']], false);
	}
	$id = -1;
	$module_id = null;
	if (!empty($response)) {
		$id = $response[0]["id"];
		$module_id = $response[0]["module_id"];
	} else {
		$sql = 'INSERT INTO `chapitres` (`name`, `module_id`, `team_id`, `user_id`) VALUES (?, ?, ?, ?);';
		$id = exequteSQL($db, $sql, [$data['name'], $data['module_id'], $data['team'], $data['user']]);
		$module_id = $data["module_id"];
	}
	return ["chapitre_id" => $id, "module_id" => $module_id];
}

$data = getPostData();
if (!isset($data["start"])) {
	$db = openDatabase();
	$id = createChapitreIfNotExist($db, $data, true)["chapitre_id"];
	$db->close();
	echo $id;
}
?>