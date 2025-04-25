<?php
$connection = new mysqli("localhost", "root", "", "etutime_2_1");
if (isset($_SERVER['HTTP_ORIGIN'])) {
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Max-Age: 1000');
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
		exit(0);
	}
}
header("Access-Control-Allow-Headers: Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");
header('Content-Type: application/json'); // Ensure JSON response

$res = array('error' => false, 'data' => null);

$action = '';
if (isset($_GET['action'])) {
	$action = $_GET['action'];
}

if ($action == 'users') {
	$sql = "SELECT id, name, email, created_at FROM users"; // Select specific columns
	$result = $connection->query($sql);

	if ($result) {
		$users = array();
		while ($row = $result->fetch_assoc()) {
			$users[] = $row;
		}
		$res['data'] = $users;
	} else {
		$res['error'] = true;
		$res['message'] = $connection->error;
	}
}

echo json_encode($res);
$connection->close();
?>