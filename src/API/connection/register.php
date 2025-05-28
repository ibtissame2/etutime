<?php
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../database.php';
try {
    // Récupération des données du formulaire
    $data = getPostData();

    if (
        empty($data['firstName']) || empty($data['lastName']) || empty($data['email']) ||
        empty($data['password']) || empty($data['level'])
    ) {
        throw new Exception("Tous les champs sont obligatoires");
    }

    // Validation de l'email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Format d'email invalide");
    }

    // Validation du mot de passe (au moins 8 caractères, une minuscule, une majuscule et un chiffre)
    if (
        strlen($data['password']) < 8 ||
        !preg_match('/[a-z]/', $data['password']) ||
        !preg_match('/[A-Z]/', $data['password']) ||
        !preg_match('/[0-9]/', $data['password'])
    ) {
        throw new Exception("Le mot de passe doit contenir au moins 8 caractères, une minuscule, une majuscule et un chiffre");
    }

    $db = openDatabase();

    // Vérifier si l'email existe déjà
    $checkEmailSQL = "SELECT id FROM users WHERE email = ?";
    $result = executeSQL($db, $checkEmailSQL, [$data['email']], false);

    if (count($result) > 0) {
        throw new Exception("Cet email est déjà utilisé");
    }

    // Hashage du mot de passe
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

    // Insertion du nouvel utilisateur
    $insertUserSQL = "INSERT INTO users (first_name, last_name, email, password, level) 
                      VALUES (?, ?, ?, ?, ?)";

    $userId = executeSQL($db, $insertUserSQL, [
        $data['firstName'],
        $data['lastName'],
        $data['email'],
        $hashedPassword,
        $data['level']
    ]);

    if (!$userId) {
        throw new Exception("Erreur lors de la création du compte");
    }

    // Récupérer les informations de l'utilisateur
    $userSQL = "SELECT id, first_name, last_name, email, level FROM users WHERE id = ?";
    $userInfo = executeSQL($db, $userSQL, [$userId], false);

    if (empty($userInfo)) {
        throw new Exception("Erreur lors de la récupération des données utilisateur");
    }

    // Démarrer la session utilisateur
    startUserSession($userInfo[0]);

    // Réponse de succès
    echo json_encode([
        'success' => true,
        'message' => 'Compte créé avec succès !',
        'user' => $userInfo[0],
        'redirect' => '/dashboard'
    ]);

} catch (Exception $e) {
    handleError($e->getMessage(), 400);
}
?>