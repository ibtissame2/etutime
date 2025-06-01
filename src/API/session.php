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

function get_user_id($db, $data, $entire_user = false)
{
	// Check: we get the user id only from localStorage variables, {{ credientials.user.id }} as integer number
	//	- Credentials contains also {{ credientials.token }} as string
	//	- These values can be accessed and sent to to PHP server via the function 'getCredentials' from 'src/store/axios.js'
	//		search in vs code: const credentials = getCredentials(); 
	//	- These values are saved in localStorage after a successfull log in or sign up in 'src/pages/SeConnecter.vue'
	//	- These values will unsset from localStorage when log out in 'src/Components/UserSettingsIcon.vue'
	if (isset($data['credentials']) && isset($data['credentials']['user']) && isset($data['credentials']['user']['id'])) {
		$id = $data['credentials']['user']['id'];
		$result = executeSQL($db, 'SELECT * from users WHERE id = ?', [$id], false);
		if (!empty($result)) {
			return $entire_user ? $result[0] : $id;
		}
	}
	handleError('Utilisateur non connecté', 401);
}
?>