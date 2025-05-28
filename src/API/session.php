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

function get_user_id($db)
{
	return 1;
}
?>