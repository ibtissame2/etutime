<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

$data = getPostData();
$db = openDatabase();
$user = get_user($db, true);
$db->close();
echo json_encode(["success" => true, "data" => $user]);
?>