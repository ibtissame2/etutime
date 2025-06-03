<?php
session_set_cookie_params([
	'lifetime' => 0,
	'path' => '/',
	'domain' => 'localhost',
	'secure' => false,
	'httponly' => true,
	'samesite' => 'Lax'
]);

session_start();

$hashKey = 'sarout12Ibtissame12mzMeryemjox45Oussama45cx1c2VyX2FnZW50IjoiTW9';

function startUserSession($user)
{
	$_SESSION['user'] = [
		'id' => $user['id'],
		'email' => $user['email'],
		'first_name' => $user['first_name'],
		'last_name' => $user['last_name'],
		'level' => $user['level'],
		'logged_in' => true
	];
}

function get_user($db, $entire_user = false)
{
	global $hashKey;
	try {
		$headers = getallheaders();
		if (isset($headers['Authorization'])) {
			$matches = [];
			if (preg_match('/Bearer\s+(.*)$/i', $headers['Authorization'], $matches)) {
				$parts = explode('.', $matches[1]);
				if (count($parts) === 2) {
					$jsonData = base64_decode($parts[0]);
					$token = json_decode($jsonData, true);
					if ($token && time() <= $token['expires_at']) {
						$expectedSignature = hash_hmac('sha256', $jsonData, $hashKey);
						if ($parts[1] == $expectedSignature) {
							$sql = 'SELECT id, first_name, last_name, email, level from users WHERE id = ?';
							$result = executeSQL($db, $sql, [$token['user_id']], false);
							if (!empty($result)) {
								return $entire_user ? $result[0] : $result[0]['id'];
							}
						}
					}
				}
			}
		}
	} catch (Exception $e) {
	}
	handleError('Utilisateur non connecté', 401);
}

function generateToken($user)
{
	global $hashKey;
	$data = [
		'user_id' => $user['id'],
		'expires_at' => time() + (24 * 60 * 60),
		'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
		'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
	];
	$jsonData = json_encode($data);
	$signature = hash_hmac('sha256', $jsonData, $hashKey);
	$token = base64_encode($jsonData) . '.' . $signature;
	return $token;
}
?>