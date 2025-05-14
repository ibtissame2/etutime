<?php
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../chapitres/create.php';

$data = getPostData();
$db = openDatabase();
$data["name"] = $data["chapitre_name"];
$ids = createChapitreIfNotExist($db, $data);
$sql = 'INSERT INTO `timers` (`module_id`, `chapitre_id`, `start`, `end`, `taches`, `team_id`, `user_id`) VALUES (?, ?, ?, ?, ?, ?, ?);';
$id = exequteSQL($db, $sql, [$ids['module_id'], $ids['chapitre_id'], $data['start'], $data['end'], json_encode($data['taches']), $data['team'], $data['user']]);
$db->close();
echo json_encode($ids);
?>