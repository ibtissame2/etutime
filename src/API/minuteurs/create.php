<?php
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../chapitres/create.php';

$data = getPostData();
$db = openDatabase();
$data["name"] = $data["chapitre_name"];
$ids = createChapitreIfNotExist($db, $data);
$sql = 'INSERT INTO `minuteurs` (`module_id`, `chapitre_id`, `start`, `end`, `user_id`) VALUES (?, ?, ?, ?, ?);';
$id = exequteSQL($db, $sql, [$ids['module_id'], $ids['chapitre_id'], $data['start'], $data['end'],  $data['user']]);
foreach ($data['taches'] as $tach) {
    exequteSQL($db, 'INSERT INTO `minuteur_taches` (`minuteur_id`, `tache_id`) VALUES (?, ?);', [$id, $tach]);
}
$db->close();
echo $id;
?>