<?php
require_once __DIR__ . '/../database.php';
try {
    // Récupération des données du formulaire
    $data = getAxiosData();

    if (empty($data['email'])) {
        throw new Exception("Email requis");
    }

    $db = openDatabase();

    // Vérifier si l'email existe
    $sql = "SELECT id, first_name, last_name FROM users WHERE email = ?";
    $result = executeSQL($db, $sql, [$data['email']], false);

    if (empty($result)) {
        // Pour des raisons de sécurité, ne pas indiquer si l'email existe ou non
        echo json_encode([
            'success' => true,
            'message' => 'Si votre email existe dans notre système, vous recevrez un lien de réinitialisation.'
        ]);
        exit;
    }

    $user = $result[0];

    // Dans un système réel, générez un token unique, stockez-le en base de données avec une date d'expiration
    // et envoyez un email contenant un lien avec ce token
    $resetToken = bin2hex(random_bytes(16));

    // Exemple : mise à jour de la base de données avec le token (non implémenté dans cet exemple)
    // Ici, vous devriez ajouter une table pour stocker les tokens de réinitialisation ou étendre la table users

    // Simuler l'envoi d'un email (dans un système réel, utilisez PHPMailer ou équivalent)
    $resetLink = "http://localhost:8080/reset-password?token=" . $resetToken;

    // Pour l'exemple, on affiche le lien qu'on enverrait normalement par email
    echo json_encode([
        'success' => true,
        'message' => 'Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception.',
        'debug_link' => $resetLink // À retirer en production
    ]);

} catch (Exception $e) {
    handleError($e->getMessage(), 400);
}
?>