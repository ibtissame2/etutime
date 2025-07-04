<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';

try {
    // Récupération des données du formulaire
    $data = getPostData();

    if (empty($data['email']) || empty($data['password'])) {
        throw new Exception("Email et mot de passe requis");
    }

    $db = openDatabase();

    // Recherche de l'utilisateur par email
    $sql = "SELECT id, first_name, last_name, email, password, level FROM users WHERE email = ?";
    $result = executeSQL($db, $sql, [$data['email']], false);

    if (empty($result)) {
        throw new Exception("Email ou mot de passe incorrect");
    }

    $user = $result[0];

    // Vérification du mot de passe
    if (!password_verify($data['password'], $user['password'])) {
        throw new Exception("Email ou mot de passe incorrect");
    }

    $user = [
        'id' => $user['id'],
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name'],
        'email' => $user['email'],
        'level' => $user['level']
    ];

    startUserSession($user);

    // Ne pas renvoyer le mot de passe hashé
    unset($user['password']);

    // Réponse de succès
    echo json_encode([
        'success' => true,
        'user' => $user,
        'token' => generateToken($user),
    ]);

} catch (Exception $e) {
    handleError($e->getMessage(), 401);
}
?>