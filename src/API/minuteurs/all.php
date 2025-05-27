<?php
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$sql = 'SELECT m.*, ch.name as chapitre_name, ch.module_id as chapitre_module_id, mt.tache_id as tache_id
        FROM minuteurs m
        LEFT JOIN chapitres ch ON ch.id = m.chapitre_id
        LEFT JOIN minuteur_taches mt ON mt.minuteur_id = m.id
        WHERE m.user_id = ?
        ORDER BY m.created_at DESC';
$minuteurs = [];
$response = exequteSQL($db, $sql, [$data['user']], false);
foreach ($response as $row) {
        $found = false;
        foreach ($minuteurs as &$minuteur) {
                if ($minuteur['id'] == $row['id']) {
                        if ($row['tache_id'] !== null) {
                                $minuteur['taches'][] = $row['tache_id'];
                        }
                        $found = true;
                        break;
                }
        }
        if (!$found) {
                $newMinuteur = $row;
                $newMinuteur['taches'] = [];
                if ($row['tache_id'] !== null) {
                        $newMinuteur['taches'][] = $row['tache_id'];
                }
                unset($newMinuteur['tache_id']);
                $minuteurs[] = $newMinuteur;
        }
}
$db->close();
echo json_encode($minuteurs);
?>