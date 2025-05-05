<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Max-Age: 1000');
	header('Access-Control-Allow-Headers: Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization');
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
}
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	exit(0);
}

function getPostData()
{
	return json_decode(file_get_contents('php://input'), true);
}

function openDatabase()
{
	return new mysqli("localhost", "root", "", "etutime_test_1");
}

function exequteSQL($db, $sql, $params = [])
{
	$response = true;
	$statment = $db->prepare($sql);
	if (!$statment) {
		throw new Exception('SQL Prepare failed: ' . $db->error);
	}
	if (!empty($params)) {
		$types = '';
		foreach ($params as $param) {
			if (is_int($param)) {
				$types .= 'i';
			} elseif (is_float($param)) {
				$types .= 'd';
			} elseif (is_string($param)) {
				$types .= 's';
			} else {
				$types .= 's';
			}
		}
		$statment->bind_param($types, ...$params);
	}
	if (!$statment->execute()) {
		throw new Exception('SQL Execute failed: ' . $statment->error);
	} else {
		if (stripos($sql, 'INSERT') === 0) {
			$response = $statment->insert_id;
		} else {
			$result = $statment->get_result();
			if (!is_bool($result)) {
				$entries = array();
				while ($row = $result->fetch_assoc()) {
					$entries[] = $row;
				}
				$response = json_encode($entries);
			}
		}
	}
	$statment->close();
	return $response;
}
?>